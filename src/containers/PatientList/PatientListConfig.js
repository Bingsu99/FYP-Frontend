export const headers = ["Name"];

export const parseToTableContent = (data) => {
    var refactoredData = []
    data.forEach(rowData => {
        var tableData = [rowData["name"]];
        var metaData = {deckID:rowData["_id"]};
        refactoredData.push({tableData:tableData, metaData:metaData});
    });

    return refactoredData
    
}