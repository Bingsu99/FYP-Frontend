export const headers = ["Name", "No. of Exercises"];

export const parseToTableContent = (data) => {
    var refactoredData = []
    data.forEach(rowData => {
        var tableData = [rowData["name"], rowData["numOfExercises"]];
        var metaData = {deckID:rowData["_id"], activity:rowData["activity"]};
        refactoredData.push({tableData:tableData, metaData:metaData});
    });

    return refactoredData
    
}