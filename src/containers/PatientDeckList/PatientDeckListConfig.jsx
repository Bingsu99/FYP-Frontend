import { numbersToActivityName } from "../../Constants";
import { serverURL } from '../../Constants';

export const headers = ["Name", "Activity", "Number of Exercise", "Remove?"];
    
export const parseToTableContent = (data, patientID, navigate) => {
    var refactoredData = []

    async function onClickHandler(activity, deckID, patientID){
        const outcome = await onRemoveAccessHandler(activity, deckID, patientID)
        if (outcome){
            navigate(0)
        }
    }
    
    data.forEach(rowData => {
        var removeButton = <button onClick={()=>onClickHandler(rowData["activity"], rowData["_id"], patientID)} className="bg-white text-gray-700 font-normal text-sm py-2 px-4 rounded focus:outline-none shadow hover:shadow-md transition duration-300 ease-in-out">
                        Remove
                        </button>
        var tableData = [rowData["name"], numbersToActivityName[rowData["activity"]], rowData["numOfExercises"], removeButton];
        var metaData = {deckID:rowData["_id"], activity:rowData["activity"]};
        refactoredData.push({tableData:tableData, metaData:metaData});
    });
    return refactoredData 
}


export async function onRemoveAccessHandler(activity, deckID, patientID){
    var params = {
        "activity": activity,
        "removeAccess": [{
            "_id" : deckID,
            "userID" : [patientID]
        }]
    }

    try {
        const response = await fetch('http://' + serverURL + '/Decks/Update', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(params),
        });

        const result = await response.json();
        console.log(result)
        if (result["status"] === "success"){
            return true
        }
        return false;
      } catch (error) {
        console.error('Error fetching data: ', error);
        return false;
      }
}

export async function onAddAccessHandler(activity, deckID, patientID){
    var params = {
        "activity": activity,
        "addAccess": [{
            "_id" : deckID,
            "userID" : [patientID]
        }]
    }

    try {
        const response = await fetch('http://' + serverURL + '/Decks/Update', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(params),
        });

        const result = await response.json();
        console.log(result)
        if (result["status"] === "success"){
            return true
        }
        return false;
      } catch (error) {
        console.error('Error fetching data: ', error);
        return false;
      }
}