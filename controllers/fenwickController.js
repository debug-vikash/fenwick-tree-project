const FenwickTree = require('../core/fenwickTree');
const Data = require('../models/Data');

let myTree = new FenwickTree(100);

async function updateValue(req, res) {
    const index = Number(req.body.index);
    const value = Number(req.body.value);

    if (!index || value === undefined) {
        return res.status(400).json({ error: "Missing index or value" });
    }
    
    try {
        let updateVal = value;
        
        const dbResult = await Data.aggregate([
            { $match: { index: index } },
            { $group: { _id: null, total: { $sum: "$value" } } }
        ]);
        const dbCurrentVal = dbResult.length > 0 ? dbResult[0].total : 0;

        if (req.body.mode === 'set') {
            updateVal = value - dbCurrentVal;
        }

        const newDbTotal = dbCurrentVal + updateVal;
        const currentMemoryVal = myTree.prefixSum(index) - myTree.prefixSum(index - 1);
        const memoryDelta = newDbTotal - currentMemoryVal;

        myTree.update(index, memoryDelta);
        await Data.create({ index: index, value: updateVal });
        
        res.json({ message: "Successfully updated tree and persisted to DB!" });
    } catch (err) {
        res.status(500).json({ error: "Failed to persist to DB.", details: err.message });
    }
}

async function getPrefixSum(req, res) {
    const index = Number(req.params.index);
    if (!index) return res.status(400).json({ error: "Missing index" });
    res.json({ sum: myTree.prefixSum(index) });
}

async function getDbPrefixSum(req, res) {
    try {
        const index = Number(req.params.index);
        if (!index) return res.status(400).json({ error: "Missing index" });

        const pipeline = [
            { $match: { index: { $lte: index } } },
            { $group: { _id: null, totalSum: { $sum: "$value" } } }
        ];
        
        const result = await Data.aggregate(pipeline);
        const dbSum = result.length > 0 ? result[0].totalSum : 0;
        const fenwickSum = myTree.prefixSum(index);

        res.json({
            fenwickSum: fenwickSum,
            dbSum: dbSum,
            difference: fenwickSum - dbSum
        });
    } catch (error) {
        res.status(500).json({ error: "Aggregation Failed", details: error.message });
    }
}

async function getAllValues(req, res) {
    res.json({ array: myTree.tree });
}

async function internalInitialize() {
    const pipeline = [
        { $group: { _id: "$index", netValue: { $sum: "$value" } } },
        { $sort: { _id: 1 } }
    ];

    const aggregatedData = await Data.aggregate(pipeline);
    const maxIndex = aggregatedData.length > 0 ? aggregatedData[aggregatedData.length - 1]._id : 100;
    myTree = new FenwickTree(Math.max(100, maxIndex + 10));

    aggregatedData.forEach(item => {
        if (item._id && item.netValue !== 0) {
            myTree.update(item._id, item.netValue);
        }
    });
    return { count: aggregatedData.length, maxIndex };
}

async function rebuildTree(req, res) {
    try {
        const stats = await internalInitialize();
        res.json({ 
            message: "Tree rebuilt successfully from database aggregation", 
            count: stats.count,
            maxIndex: stats.maxIndex 
        });
    } catch (error) {
        res.status(500).json({ error: "Rebuild Failed", details: error.message });
    }
}

module.exports = {
    updateValue,
    getPrefixSum,
    getAllValues,
    getDbPrefixSum,
    rebuildTree,
    internalInitialize
};
