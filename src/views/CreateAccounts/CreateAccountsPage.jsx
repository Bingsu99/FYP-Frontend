import React, { useContext, useState } from 'react';
import MainLayout from "../../layout/MainLayout";
import AuthContext from '../../context/AuthContext';
import {serverURL} from "../../Constants"
import { Button } from 'flowbite-react';

function CreateAccountsPage() {
    const { userRole, userID } = useContext(AuthContext); 
    const [patient, setPatient] = useState({ name: '', email: '', contact: '' });
    const [caregiver, setCaregiver] = useState({ name: '', email: '', contact: '' });

    const handleInputChange = (userType, field, value) => {
        if (userType === 'patient') {
            setPatient({ ...patient, [field]: value });
        } else {
            setCaregiver({ ...caregiver, [field]: value });
        }
    };
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        const registrationData = { patient, caregiver, therapist: userID };
        console.log(registrationData)

        try {
            const response = await fetch('http://' + serverURL + '/RegistrationToken/Pair', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify(registrationData),
            });
            const result = await response.json();
            console.log(result)
          } catch (error) {
            console.error('Error fetching data: ', error);
          }
        
    };

    return(
        <MainLayout user={userRole}>
            
            <form onSubmit={handleSubmit} className="w-full p-5">
            <h2 className="text-3xl col-span-10 font-extrabold text-gray-900 pt-2 pb-5">
                Create New Accounts
            </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                    <div className="md:col-span-2">
                        <h2 className="block text-md font-medium text-gray-700 underline">Patient Information</h2>
                    </div>
                    <div>
                        <label htmlFor="patientName" className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            id="patientName"
                            type="text"
                            name="patientName"
                            value={patient.name}
                            onChange={(e) => handleInputChange('patient', 'name', e.target.value)}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label htmlFor="patientContact" className="block text-sm font-medium text-gray-700">Contact Number</label>
                        <input
                            id="patientContact"
                            type="text"
                            name="patientContact"
                            value={patient.contact}
                            onChange={(e) => handleInputChange('patient', 'contact', e.target.value)}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                        
                    </div>
                    <div className="mb-4 md:col-span-2">
                        <label htmlFor="patientEmail" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                id="patientEmail"
                                type="email"
                                name="patientEmail"
                                value={patient.email}
                                onChange={(e) => handleInputChange('patient', 'email', e.target.value)}
                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                    </div>
                    <div className="md:col-span-2">
                        <h2 className="block text-md font-medium text-gray-700 underline">Caregiver Information</h2>
                    </div>
                    <div>
                        <label htmlFor="caregiverName" className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            id="caregiverName"
                            type="text"
                            name="caregiverName"
                            value={caregiver.name}
                            onChange={(e) => handleInputChange('caregiver', 'name', e.target.value)}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label htmlFor="caregiverContact" className="block text-sm font-medium text-gray-700">Contact Number</label>
                        <input
                            id="caregiverContact"
                            type="text"
                            name="caregiverContact"
                            value={caregiver.contact}
                            onChange={(e) => handleInputChange('caregiver', 'contact', e.target.value)}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="mb-4 md:col-span-2">
                        <label htmlFor="caregiverEmail" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            id="caregiverEmail"
                            type="email"
                            name="caregiverEmail"
                            value={caregiver.email}
                            onChange={(e) => handleInputChange('caregiver', 'email', e.target.value)}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                    </div>
                </div>
                <div className="text-right mt-4">
                    <Button type="submit" className="inline-flex justify-center py-1 px-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Register
                    </Button>
                </div>
            </form>
        </MainLayout>
    );
}

export default CreateAccountsPage;
