import React, { useState, useEffect } from 'react';
import BasicTable from '../../components/BasicTable/BasicTable';
import {serverURL, mapActivityToNumbers} from "../../Constants"
import { useNavigate } from 'react-router-dom';
import {headers, parseToTableContent} from "./DecksConfig"
import DecksModal from './DecksModal/DecksModal';


function Decks() {
  const [openModal, setOpenModal] = useState(false);
    let navigate = useNavigate();
    const [decks, setDecks] = useState([]);
    const handleRowClick = (metaData) => {
        navigate(mapActivityToNumbers[metaData["activity"]] + "/" +metaData["deckID"]);
    } 

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch('http://' + serverURL + '/decks/creator', {
              method: 'POST', // Specify the method as POST
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                "_id": '65cf5904d17de3eaa6e44e56',
              }),
            });
            const result = await response.json();
            setDecks(parseToTableContent(result["data"]));
          } catch (error) {
            console.error('Error fetching data: ', error);
          }
        };
      
        fetchData();
      }, []);

    return(
        <>
            <div className="grid grid-rows-12">
            <div className="grid row-span-1 grid-cols-12 gap-3 px-5 items-end">
                <h2 className="text-3xl col-span-10 font-extrabold text-gray-900 pl-2 pt-5">
                    My Decks
                </h2>
                <button onClick={() => setOpenModal(true)} className="bg-white col-span-2 text-gray-700 font-normal text-sm py-2 px-4 rounded focus:outline-none shadow hover:shadow-md transform transition duration-300 ease-in-out justify-self-end">Create</button>
            </div>
                <div className="row-span-11">
                    <BasicTable headers={headers} items={decks} searchIndex={0} categoriseIndex={1} handleRowClick={handleRowClick}/>
                    <DecksModal isOpen={openModal} closeModal={() => setOpenModal(false)}/>
                </div>
                
            </div>
        </>
    );
}

export default Decks;
