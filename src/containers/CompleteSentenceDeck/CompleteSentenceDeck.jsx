import React, { useState, useEffect, useContext } from 'react';
import BasicTable from '../../components/BasicTable/BasicTable';
import CompleteSentenceModal from '../../containers/CompleteSentenceDeck/CompleteSentenceModal/CompleteSentenceModal';
import {serverURL} from "../../Constants"
import { useNavigate } from 'react-router-dom';
import { emptyValues, tableHeaders, parseToTableContent } from './CompleteSentenceDeckConfig';
import AuthContext from '../../context/AuthContext';

function CompleteSentenceDeck({deckID}) {
    const { userType } = useContext(AuthContext);
    const [openModal, setOpenModal] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [isExisting, setIsExisting] = useState(false);    // Track if Modal open is to do save or update operation
    const [name, setName] = useState("");
    const [data, setData] = useState([]);

    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch('http://' + serverURL + '/Decks/Read', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                "_id": deckID,
                "activity": 0
              }),
            });
            const result = await response.json();
            setName(result["data"]["name"])
            setData(parseToTableContent(result["data"]))
          } catch (error) {
            console.error('Error fetching data: ', error);
          }
        };
      
        fetchData();
      }, []);
      
    const handleRowClick = (metaData) => {
        console.log(metaData)
        setSelectedRowData(metaData);
        setIsExisting(true);
        setOpenModal(true);
    };

    const handleAddAction = () => {
        setSelectedRowData("");
        setOpenModal(true);
        setIsExisting(false);
        setSelectedRowData({...emptyValues, ["_id"]: deckID})   //Add Deck ObjectID for easier adding of new Data
    };

    const handleDeleteAction = async () => {
        try {
            const response = await fetch('http://' + serverURL + '/Decks/Delete', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    "_id": deckID,
                    "activity": 0,
                    "userType": userType
                }),
            });
            const result = await response.json();
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
        navigate(-1);
    };

    const handleBackAction = async () => {
        navigate(-1);
    };

    return(
        <>
            <div className="h-[25%] lg:h-[15%] px-5 lg:px-8 pb-3 flex justify-between items-end">
                <div>
                    <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900">
                        {name}
                    </h2>
                    <p className="text-sm text-gray-600 italic">Activity: Complete the Sentence</p>
                    <p className="text-sm text-gray-600 italic">Number of Exercises: {data.length}</p>
                </div>
                <div className="flex space-x-2 pt-5">
                    <button onClick={handleBackAction} className="bg-white text-gray-700 font-normal text-sm py-2 px-4 rounded focus:outline-none shadow hover:shadow-md transform transition duration-300 ease-in-out">Back</button>
                    <button onClick={handleDeleteAction} className="bg-white text-gray-700 font-normal text-sm py-2 px-4 rounded focus:outline-none shadow hover:shadow-md transform transition duration-300 ease-in-out">Delete</button>
                    <button onClick={handleAddAction} className="bg-white text-gray-700 font-normal text-sm py-2 px-4 rounded focus:outline-none shadow hover:shadow-md transform transition duration-300 ease-in-out">Add</button>
                </div>
            </div>
            <div className="h-[75%] lg:h-[85%] px-5 lg:px-8">
                <BasicTable headers={tableHeaders} items={data} searchIndex={0} categoriseIndex={0} handleRowClick={handleRowClick} height={70}/>
                <CompleteSentenceModal isOpen={openModal} closeModal={() => setOpenModal(false)} rowData={selectedRowData} isExisiting={isExisting}/>
            </div>
        </>
    );
}

export default CompleteSentenceDeck;
