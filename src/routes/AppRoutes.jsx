// routes/index.js
import React, {Suspense, lazy} from 'react';
import { Routes, Route } from 'react-router-dom';

// Authorisation and Re-routing
const RedirectBasedOnRole = lazy(() => import("./RedirectBasedOnRole"));
const PrivateRoute = lazy(() => import('./PrivateRoute'));

// Static Pages
const UnauthorisedPage = lazy(() => import("../Pages/Unauthorised/UnauthorisedPage"));
const NotFoundPage = lazy(() => import("../Pages/NotFound/NotFoundPage"));

// Dynamic Views
const LoginPage = lazy(() => import('../views/Login/LoginPage'));
const TokenRegisterPage = lazy(() => import('../views/Register/TokenRegisterPage'));
const RegisterPage = lazy(() => import('../views/Register/RegisterPage'));
const HomePage = lazy(() => import('../views/Home/HomePage'));
const DecksPage = lazy(() => import('../views/Decks/DecksPage'));
const DeckPage = lazy(() => import('../views/Deck/DeckPage'));
const PatientsPage = lazy(() => import('../views/Patients/PatientsPage'));
const ActivitiesPage = lazy(() => import("../views/Activities/ActivitiesPage"));
const ActivityPage = lazy(() => import("../views/Activity/ActivityPage"));
const CreateAccountsPage = lazy(() => import("../views/CreateAccounts/CreateAccountsPage"));
const ActivityDeckSelectionPage = lazy(() => import("../views/ActivityDeckSelection/ActivityDeckSelectionPage"));
const PatientsDetailsPage = lazy(() => import("../views/PatientDetails/PatientDetailsPage"));
const PatientDecksPage = lazy(() => import("../views/PatientDecks/PatientDecksPage"));
const StatisticPage = lazy(() => import("../views/Statistics/StatisticPage"));
const CompletedActivityPage = lazy(() => import("../views/Activity/CompletedActivityPage"));
const PatientAssignmentPage = lazy(() => import("../views/PatientAssignment/PatientAssignmentPage"))


const AppRoutes = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Routes>
      <Route path="/" element={<RedirectBasedOnRole />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/register/:token" element={<TokenRegisterPage />} />

      {/* Routing for All */}
      <Route element={<PrivateRoute allowedRoles={['patient', 'therapist', 'caregiver']} />}>
        <Route path="/activity" element={<ActivityPage />} />
        <Route path="/Result" element={<CompletedActivityPage />} />
      </Route>

      {/* Routing for Patient */}
      <Route element={<PrivateRoute allowedRoles={['patient']} />}>
        <Route path="/patient" element={<HomePage />} />
        <Route path="/patient/activities" element={<ActivitiesPage />} />
        {/* <Route path="/patient/activity" element={<ActivityPage />} /> */}
        <Route path="/patient/activity/Result" element={<CompletedActivityPage />} />
        <Route path="/patient/decks/:activity" element={<ActivityDeckSelectionPage />} />
      </Route>

      {/* Routing for Therapist */}
      <Route element={<PrivateRoute allowedRoles={['therapist']} />}>
        <Route path="/therapist" element={<PatientsPage />} />
        <Route path="/therapist/:patientID" element={<PatientsDetailsPage />} />
        <Route path="/therapist/:patientID/Decks" element={<PatientDecksPage />} />
        <Route path="/therapist/:patientID/Statistic" element={<StatisticPage />} />
        <Route path="/therapist/:patientID/DailyAssignment" element={<PatientAssignmentPage />} />
        <Route path="/therapist/decks" element={<DecksPage />} />
        <Route path="/therapist/decks/:activity/:deckID/" element={<DeckPage />} />
        <Route path="/therapist/create" element={<CreateAccountsPage />} />
      </Route>
      
      {/* Routing for Caregiver */}
      <Route element={<PrivateRoute allowedRoles={['caregiver']} />}>
        <Route path="/caregiver" element={<PatientsPage />} />
        <Route path="/caregiver/:patientID" element={<PatientsDetailsPage />} />
        <Route path="/caregiver/:patientID/Decks" element={<PatientDecksPage />} />
        <Route path="/caregiver/:patientID/Statistic" element={<StatisticPage />} />
        <Route path="/caregiver/:patientID/DailyAssignment" element={<PatientAssignmentPage />} />
        <Route path="/caregiver/decks" element={<DecksPage />} />
        <Route path="/caregiver/decks/:activity/:deckID/" element={<DeckPage />} />
      </Route>

      {/* Fallback routes */}
      <Route path="/unauthorized" element={<UnauthorisedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
