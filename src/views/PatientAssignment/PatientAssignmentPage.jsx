import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from "../../layout/MainLayout"
import AuthContext from '../../context/AuthContext';
import BasicTable from '../../components/BasicTable/BasicTable';
import { headers, parseToTableContent } from './PatientAssignmentPageConfig';
import { serverURL } from '../../Constants';
import DailyAssignmentModal from './Modals/DailyAssignmentModal';

function PatientAssignmentPage() {
    const { userRole, name } = useContext(AuthContext);
    let { patientID } = useParams();
    const [data, setData] = useState([]);
    const [decks, setDecks] = useState({});
    const [numOfExercises, setNumOfExercises] = useState({});
    const [activitySelected, setActivitySelected] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    let navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch('http://' + serverURL + '/Decks/DailyAssignment', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    "_id": patientID,
              }),
            });
            const result = await response.json();
            console.log(result)
            setData(parseToTableContent(result["data"]["dailyAssignment"], setOpenModal, setActivitySelected))
            setDecks(result["data"]["dailyAssignment"]["decks"])
            setNumOfExercises(result["data"]["dailyAssignment"]["exerciseRequirements"])
          } catch (error) {
            console.error('Error fetching data: ', error);
          }
        };
      
        fetchData();
    }, []);

    return(
        <MainLayout user={userRole}>
            <div className="h-[15%] lg:h-[10%] px-5 lg:px-8 pb-3 flex justify-between items-end ">
                <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900">
                    Patient's Daily Assignment
                </h2>
                <div className="flex space-x-2 pt-5">
                    <button onClick={()=>navigate(-1)} className="bg-white text-gray-700 font-normal text-sm py-2 px-4 rounded focus:outline-none shadow hover:shadow-md transition duration-300 ease-in-out">
                        Back
                    </button>
                </div>
            </div>
            <div className="h-[85%] lg:h-[90%] px-5 lg:px-8">
              <BasicTable headers={headers} items={data} searchIndex={0} categoriseIndex={1} handleRowClick={""} height={75}/>
              {(openModal)&&<DailyAssignmentModal isOpen={openModal} closeModal={() => setOpenModal(false)} activity={activitySelected} numOfExercises={numOfExercises[activitySelected]} decks={decks[activitySelected]}/>}
            </div>
        </MainLayout>
    );
}

export default PatientAssignmentPage;