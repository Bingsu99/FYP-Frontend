import { numbersToActivityName } from "../../Constants";

export const headers = ["Activity", "No. of Exercises", "No. of Decks", "Edit"];

export const parseToTableContent = (data, setOpenModal, setActivitySelected) => {
    var refactoredData = []
    function handleSelection(activity){
        setOpenModal(true);
        setActivitySelected(activity);
    }

    Object.entries(numbersToActivityName).forEach(([activityKey, activityName]) => {
        var openModalButton = <button onClick={()=>handleSelection(activityKey)} className="bg-white text-gray-700 font-normal text-sm py-2 px-4 rounded focus:outline-none shadow hover:shadow-md transition duration-300 ease-in-out">Edit</button>
        if (data["decks"][activityKey] !== undefined){
            var tableData = [activityName, data["exerciseRequirements"][activityKey], data["decks"][activityKey].length, openModalButton];
            var metaData = {activityKey, decks:data["decks"][activityKey], exerciseRequirements:data["exerciseRequirements"][activityKey]};
            refactoredData.push({tableData, metaData});
        }
    });

    return refactoredData
    
}