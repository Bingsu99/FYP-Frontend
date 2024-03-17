import React, { useState, useContext, useEffect } from 'react';
import { serverURL } from '../../Constants';
import BasicTable from '../../components/BasicTable/BasicTable';
import { useParams, useNavigate } from 'react-router-dom';
import { headers, parseToTableContent } from './PatientDeckListConfig';
import AddDeckAccessModal from './Modals/AddDeckAccessModal';
import AuthContext from '../../context/AuthContext';

function PatientDeckList() {
    const { userRole, userID } = useContext(AuthContext); // Can be caregiver or therapist
    const [openModal, setOpenModal] = useState(false);
    const [data, setData] = useState([]);
    const [patientExerciseAccess, setPatientExerciseAccess] = useState(null);
    let { patientID } = useParams();
    let navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch('http://' + serverURL + '/Decks/Access', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                "_id": patientID,
              }),
            });
            const result = await response.json();
            console.log(result["data"])
            if (result["status"] === "success"){
                setData(parseToTableContent(result["data"], patientID, navigate))
                setPatientExerciseAccess(result["data"].map(execise => execise._id))
            }
            
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
                    Patient's Deck
                </h2>
                <div className="flex space-x-2 pt-5">
                    <button onClick={()=>navigate(-1)} className="bg-white text-gray-700 font-normal text-sm py-2 px-4 rounded focus:outline-none shadow hover:shadow-md transition duration-300 ease-in-out">
                        Back
                    </button>
                    <button onClick={() => setOpenModal(true)} className="bg-white text-gray-700 font-normal text-sm py-2 px-4 rounded focus:outline-none shadow hover:shadow-md transition duration-300 ease-in-out">
                        Add Decks
                    </button>
                </div>
            </div>
            <div className="h-[85%] lg:h-[90%] px-5 lg:px-8">
              <BasicTable headers={headers} items={data} searchIndex={0} categoriseIndex={1} handleRowClick={""} height={75}/>
              {(patientExerciseAccess!==null)&&<AddDeckAccessModal isOpen={openModal} closeModal={() => setOpenModal(false)} patientAccess={patientExerciseAccess} />}
            </div>
             
        </>
    );
}


export default PatientDeckList;