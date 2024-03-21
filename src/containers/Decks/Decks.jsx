import React, { useState, useEffect, useContext} from 'react';
import BasicTable from '../../components/BasicTable/BasicTable';
import { serverURL } from "../../Constants"
import { useNavigate } from 'react-router-dom';
import { headers, parseToTableContent } from "./DecksConfig"
import { Dropdown } from 'flowbite-react';
import CreateDeckModal from './CreateDeckModal/CreateDeckModal';
import AuthContext from '../../context/AuthContext';


function Decks() {
  const [openModal, setOpenModal] = useState(false);
  const [decks, setDecks] = useState([]);
  let navigate = useNavigate();
  
  const { userID } = useContext(AuthContext);


  const handleRowClick = (metaData) => {
      navigate(metaData["activity"] + "/" +metaData["deckID"]);
  } 

  useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch('http://' + serverURL + '/decks/creator', {
            method: 'POST', // Specify the method as POST
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              "_id": userID,
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
            <div className="h-[15%] lg:h-[10%] px-5 lg:px-8 pb-3 flex justify-between items-end ">
                <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900">
                    My Decks
                </h2>
                <Dropdown label="Create" className="bg-white text-gray-700">
                  <Dropdown.Item>Manual</Dropdown.Item>
                  <Dropdown.Item>AI</Dropdown.Item>
                </Dropdown>
                {/* <button onClick={() => setOpenModal(true)} className="bg-white text-gray-700 font-normal text-sm py-2 px-4 rounded focus:outline-none shadow hover:shadow-md transform transition duration-300 ease-in-out justify-self-end">Create</button> */}
            </div>
            <div className="h-[85%] lg:h-[90%] px-5 lg:px-8">
                <BasicTable headers={headers} items={decks} searchIndex={0} categoriseIndex={1} handleRowClick={handleRowClick}/>
                <CreateDeckModal isOpen={openModal} closeModal={() => setOpenModal(false)}/>
            </div>
                
          </>
  );
}

export default Decks;
