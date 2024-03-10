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

const AppRoutes = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Routes>
      <Route path="/" element={<RedirectBasedOnRole />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/register/:token" element={<TokenRegisterPage />} />

      {/* Routing for Patient */}
      <Route element={<PrivateRoute allowedRoles={['patient']} />}>
        <Route path="/patient" element={<HomePage />} />
        <Route path="/patient/activities" element={<ActivitiesPage />} />
        <Route path="/patient/activity" element={<ActivityPage />} />
      </Route>

      {/* Routing for Therapist */}
      <Route element={<PrivateRoute allowedRoles={['therapist']} />}>
        <Route path="/therapist" element={<PatientsPage />} />
        <Route path="/therapist/decks" element={<DecksPage />} />
        <Route path="/therapist/decks/:activity/:deckID/" element={<DeckPage />} />
        <Route path="/therapist/create" element={<CreateAccountsPage />} />
      </Route>

      {/* Routing for Caregiver */}
      <Route element={<PrivateRoute allowedRoles={['caregiver']} />}>
        <Route path="/caregiver" element={<PatientsPage />} />
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
