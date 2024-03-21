import React, { useState, useEffect, useContext } from 'react';
import BasicTable from '../../components/BasicTable/BasicTable';
import CompleteSentenceModal from './CompleteSentenceModal/CompleteSentenceModal';
import RepeatSentenceModal from './RepeatSentenceModal/RepeatSentenceModal';
import {serverURL, numbersToActivityName} from "../../Constants"
import { useNavigate, useParams } from 'react-router-dom';
import { tableHeaders, parseToTableContent } from './DeckConfig';
import AuthContext from '../../context/AuthContext';

function Deck() {
    const { userRole } = useContext(AuthContext);
    let { activity, deckID } = useParams();
    const [openModal, setOpenModal] = useState({0:false,1:false});  // To initialise more numbers for more activities
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
                "activity": activity
              }),
            });

            const result = await response.json();
            console.log(result)
            setName(result["data"]["name"])
            setData(parseToTableContent[activity](result["data"]))
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
        setOpenModal(prevState => ({
            ...prevState,
            [activity]: true
        }));
    };

    const handleCloseModal = () =>{
        setOpenModal(prevState => ({
            ...prevState,
            [activity]: false
        }));
        setSelectedRowData("");
    }

    const handleAddAction = () => {
        setSelectedRowData("");
        setOpenModal(prevState => ({
            ...prevState,
            [activity]: true
        }));
        setIsExisting(false);
    };

    const handleDeleteAction = async () => {
        try {
            const response = await fetch('http://' + serverURL + '/Decks/Delete', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    "_id": deckID,
                    "activity": activity,
                    "userType": userRole
                }),
            });
            const result = await response.json();
            console.log(result)
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
                    <p className="text-sm text-gray-600 italic">{"Activity: " + numbersToActivityName[activity]}</p>
                    <p className="text-sm text-gray-600 italic">Number of Exercises: {data.length}</p>
                </div>
                <div className="flex space-x-2 pt-5">
                    <button onClick={handleBackAction} className="bg-white text-gray-700 font-normal text-sm py-2 px-4 rounded focus:outline-none shadow hover:shadow-md transform transition duration-300 ease-in-out">Back</button>
                    <button onClick={handleDeleteAction} className="bg-white text-gray-700 font-normal text-sm py-2 px-4 rounded focus:outline-none shadow hover:shadow-md transform transition duration-300 ease-in-out">Delete</button>
                    <button onClick={handleAddAction} className="bg-white text-gray-700 font-normal text-sm py-2 px-4 rounded focus:outline-none shadow hover:shadow-md transform transition duration-300 ease-in-out">Add</button>
                </div>
            </div>
            <div className="h-[75%] lg:h-[85%] px-5 lg:px-8">
                <BasicTable headers={tableHeaders[activity]} items={data} searchIndex={0} categoriseIndex={0} handleRowClick={handleRowClick} height={70}/>
                {openModal[0]&&<CompleteSentenceModal isOpen={openModal[0]} closeModal={() => handleCloseModal()} rowData={selectedRowData} isExisiting={isExisting}/>}
                {openModal[1]&&<RepeatSentenceModal isOpen={openModal[1]} closeModal={() => handleCloseModal()} rowData={selectedRowData} isExisiting={isExisting}/>}
            </div>
        </>
    );
}

export default Deck;
