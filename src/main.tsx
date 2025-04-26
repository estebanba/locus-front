import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import './index.css'
import { Layout } from './components/layout/Layout'
import { About } from './pages/About'
import { Work } from './pages/Work';
// import { Home } from './pages/Home';
// import { Start } from './pages/Start';
import { SearchTable } from './components/SearchTable';
import { Projects } from './pages/Projects';
import { Photography } from './pages/Photography';

const router = createBrowserRouter([
  // {
  //   path: "/",
  //   Component: About,
  // },
  
  {
    Component: Layout,
    children: [
        { path: "/", Component: About },
        {
          path: "about",
          element: <About />,
        },
        {
          path: "work",
          element: <Work />,
        },
        {
          path: "projects",
          element: <Projects />,
        },
        {
          path: "photography",
          element: <Photography />,
        },
        {
          path: "search",
          element: <SearchTable />,
        },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <RouterProvider router={router} />
  </StrictMode>,
)
