export const completeTheSentenceFunc = (data) => {
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

export const repeatTheSentenceFunc = (data) => {
    var refactoredData = []
    var exercises = data["exercises"]
    exercises.forEach(exercise => {
        var tableData = [exercise["sentence"]];
        var metaData = {
            _id: data["_id"],
            exerciseID: exercise["_id"],
            sentence: exercise["sentence"],
            recording: exercise["recording"],
        };
        refactoredData.push({tableData:tableData, metaData:metaData});
    });
    return refactoredData
    
}

export const parseToTableContent = {
    0: completeTheSentenceFunc,
    1: repeatTheSentenceFunc
}

export const tableHeaders = {
    0: ["Name"],
    1: ["Name"],
}