export const emptyValues = {
    sentence: '',
    wordsToHide: '',
    incorrectWords: ''
};

export const tableHeaders = ["Name"]

export const parseToTableContent = (data) => {
    var refactoredData = []
    var exercises = data["exercises"]
    exercises.forEach(exercise => {
        var tableData = [exercise["sentence"]];
        var metaData = {
            _id: data["_id"],
            exerciseID: exercise["_id"],
            sentence: exercise["sentence"],
            wordsToHide: exercise["wordsToHide"],
            incorrectWords: exercise["incorrectWords"],
        };
        refactoredData.push({tableData:tableData, metaData:metaData});
    });
    console.log(refactoredData)
    return refactoredData
    
}