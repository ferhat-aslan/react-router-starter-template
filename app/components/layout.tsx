import {NavLink} from "react-router";
import {ThemeSwitcher} from "./theme-switcher";

const Layout = ({children}: any) => {
  return (
    <>
      {/* ========== HEADER ========== */}

      <header className="sticky top-0 z-50">
        <nav
          className="
          flex flex-wrap
          items-center
          justify-between
          w-full
          py-4
          md:py-0
          px-4
          text-lg text-gray-700
           container mx-auto  border border-gray-200 dark:border-neutral-700 h-13
        "
        >
          <div>
            <a href="#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="150"
                height="32.125"
                viewBox="0 0 150 32.125"
              >
                <g
                  id="Group_330"
                  data-name="Group 330"
                  transform="translate(-251.1 457.654)"
                >
                  <g
                    id="Group_329"
                    data-name="Group 329"
                    transform="translate(251.1 -457.654)"
                  >
                    <path
                      id="Path_121"
                      data-name="Path 121"
                      d="M257.887-454.034a12.084,12.084,0,0,1,3.505-3.62,11.811,11.811,0,0,1,3.46,3.549,17.887,17.887,0,0,1,3.362,11.216c.73.589,1.482,1.154,2.2,1.754a3.969,3.969,0,0,1,1.266,3.659c-.347,1.672-.679,3.347-1.045,5.015a1.393,1.393,0,0,1-2.12.7c-1.178-.946-2.326-1.925-3.5-2.872a5.373,5.373,0,0,1-3.316,1.44,5.365,5.365,0,0,1-3.882-1.4c-.844.621-1.628,1.367-2.453,2.033a6.315,6.315,0,0,1-1.2.924,1.393,1.393,0,0,1-1.839-.9c-.377-1.631-.771-3.257-1.136-4.89a3.96,3.96,0,0,1,1.335-3.81c.641-.517,1.29-1.025,1.943-1.527.182-.092.091-.3.1-.46a17.915,17.915,0,0,1,3.326-10.806m1.156,5.049a2.748,2.748,0,0,0,.24,3.641,3.024,3.024,0,0,0,4.134.085,2.75,2.75,0,0,0,.729-3.021,2.924,2.924,0,0,0-2.454-1.825,2.984,2.984,0,0,0-2.65,1.119"
                      transform="translate(-251.1 457.654)"
                      fill="#764abc"
                    />
                    <path
                      id="Path_122"
                      data-name="Path 122"
                      d="M260.3-419.746a.693.693,0,0,1,1.027-.557,6.628,6.628,0,0,0,5.77,0,.7.7,0,0,1,1.029.516q.008,1.532,0,3.064a.691.691,0,0,1-1.079.5c-.306-.26-.582-.552-.876-.825-.467.874-.905,1.76-1.375,2.631a.7.7,0,0,1-1.161.007c-.472-.873-.908-1.764-1.384-2.637-.29.275-.566.566-.873.825a.692.692,0,0,1-1.078-.506c-.008-1.007,0-2.015,0-3.022"
                      transform="translate(-253.92 446.225)"
                      fill="#764abc"
                    />
                    <path
                      id="Path_123"
                      data-name="Path 123"
                      d="M265.28-441.9a1.4,1.4,0,0,0,1.432-1.376,1.4,1.4,0,0,0-1.432-1.377,1.4,1.4,0,0,0-1.431,1.377,1.4,1.4,0,0,0,1.431,1.376"
                      transform="translate(-255.01 453.668)"
                      fill="#764abc"
                    />
                    <path
                      id="Path_124"
                      data-name="Path 124"
                      d="M288.561-448.233H290.8v15.127h9.357v2.036h-11.6Zm13.563,11.211a5.99,5.99,0,0,1,.546-2.557,6.4,6.4,0,0,1,1.479-2.037,6.769,6.769,0,0,1,4.751-1.818,6.592,6.592,0,0,1,4.666,1.733,5.891,5.891,0,0,1,1.891,4.521,5.9,5.9,0,0,1-2.024,4.544,6.767,6.767,0,0,1-4.751,1.807A6.582,6.582,0,0,1,304-432.549a5.832,5.832,0,0,1-1.879-4.472m2.3-.133a4.517,4.517,0,0,0,.339,1.757A4.36,4.36,0,0,0,305.7-434a4.381,4.381,0,0,0,3.2,1.235,4.1,4.1,0,0,0,3.03-1.235,4.107,4.107,0,0,0,1.224-3.043,4.325,4.325,0,0,0-1.273-3.188,4.335,4.335,0,0,0-3.2-1.26,4.074,4.074,0,0,0-3.03,1.249,4.213,4.213,0,0,0-1.224,3.091m16.677,1.078a2.077,2.077,0,0,0-.582,1.3.918.918,0,0,0,.413.849,3.845,3.845,0,0,0,1.1.413q.692.157,1.564.266t1.794.218q.909.121,1.782.315a6.957,6.957,0,0,1,1.575.509,2.345,2.345,0,0,1,1.516,2.158,4.306,4.306,0,0,1-1.9,3.563,6.821,6.821,0,0,1-4.157,1.321,7.745,7.745,0,0,1-3.806-.873,3.147,3.147,0,0,1-1.831-2.861,3.762,3.762,0,0,1,.9-2.315,5.143,5.143,0,0,1,.558-.606,2.3,2.3,0,0,1-1.758-2.17,4.315,4.315,0,0,1,1.6-3.321,3.385,3.385,0,0,1-.557-1.878,3.7,3.7,0,0,1,.424-1.806,4.118,4.118,0,0,1,1.152-1.321,5.62,5.62,0,0,1,3.5-1.115,5.436,5.436,0,0,1,3.466,1.115,4.661,4.661,0,0,1,2.5-1.043,6.619,6.619,0,0,1,.945-.072l-.1,1.879a6.307,6.307,0,0,0-2.218.569,3.709,3.709,0,0,1,.412,1.721,3.4,3.4,0,0,1-.436,1.7,4.025,4.025,0,0,1-1.14,1.31,5.554,5.554,0,0,1-3.405,1.091,5.887,5.887,0,0,1-3.309-.91m.582-4.253a2.143,2.143,0,0,0-.231,1.017,2.221,2.221,0,0,0,.231,1.031,2.275,2.275,0,0,0,.654.739,3.493,3.493,0,0,0,2.085.582,2.688,2.688,0,0,0,2.594-1.285,2.074,2.074,0,0,0,.231-1.006,2.135,2.135,0,0,0-.243-1.03,2.124,2.124,0,0,0-.642-.751,3.446,3.446,0,0,0-2.085-.594,2.682,2.682,0,0,0-2.594,1.3m.024,8.944a3.151,3.151,0,0,0-.837,2.194,1.783,1.783,0,0,0,1.2,1.611,4.619,4.619,0,0,0,1.975.473,7.943,7.943,0,0,0,1.6-.134,3.885,3.885,0,0,0,1.139-.4,1.942,1.942,0,0,0,1.176-1.769q0-1.079-2.085-1.443-.9-.157-2.194-.279t-1.975-.254m27.052-11.563a5.27,5.27,0,0,1-3.515,5.273l3.261,6.606H345.9l-2.945-5.976a16.725,16.725,0,0,1-2.509.182h-4.461v5.793h-2.241v-17.163h7.042a12.082,12.082,0,0,1,5.684,1.042,4.451,4.451,0,0,1,2.291,4.242m-8.012,4.048a8.338,8.338,0,0,0,4.024-.752,3.344,3.344,0,0,0,1.612-3.151q0-2.885-3.733-3.273a19.936,19.936,0,0,0-2.218-.121h-4.449v7.3Zm10.7,1.879a5.99,5.99,0,0,1,.546-2.557,6.4,6.4,0,0,1,1.479-2.037,6.77,6.77,0,0,1,4.751-1.818A6.591,6.591,0,0,1,362.9-441.7a5.894,5.894,0,0,1,1.891,4.521,5.9,5.9,0,0,1-2.024,4.544,6.767,6.767,0,0,1-4.751,1.807,6.582,6.582,0,0,1-4.678-1.721,5.831,5.831,0,0,1-1.879-4.472m2.3-.133a4.517,4.517,0,0,0,.34,1.757,4.37,4.37,0,0,0,.933,1.394,4.383,4.383,0,0,0,3.2,1.235,4.1,4.1,0,0,0,3.03-1.235,4.107,4.107,0,0,0,1.224-3.043,4.325,4.325,0,0,0-1.273-3.188,4.336,4.336,0,0,0-3.2-1.26,4.073,4.073,0,0,0-3.03,1.249,4.214,4.214,0,0,0-1.224,3.091m23.344,3.491.424,1.709a7.408,7.408,0,0,1-4.46,1.127,5.729,5.729,0,0,1-4.412-1.721,6.409,6.409,0,0,1-1.563-4.557,6.234,6.234,0,0,1,1.757-4.509,5.974,5.974,0,0,1,4.448-1.818,6.431,6.431,0,0,1,3.9,1.1l-.8,1.805a5.411,5.411,0,0,0-3.321-1.017,3.3,3.3,0,0,0-2.7,1.284,4.622,4.622,0,0,0-.982,3.006,4.82,4.82,0,0,0,1.03,3.175,3.638,3.638,0,0,0,2.969,1.309,8.3,8.3,0,0,0,3.708-.9m3.066-16.326h2.3v12.133l5.442-5.333h2.69l-5.7,5.575,3.394,3.66a3.824,3.824,0,0,0,2.569,1.249l-.352,1.636a3.724,3.724,0,0,1-2.981-.678,6.8,6.8,0,0,1-.691-.667l-4.375-4.728v6.073h-2.3Zm22.108,7.866a4.441,4.441,0,0,1,1.006,1.624,5.626,5.626,0,0,1,.376,2.049,15.688,15.688,0,0,1-.243,2.533h-8.436a4.022,4.022,0,0,0,1.188,2.315,3.741,3.741,0,0,0,2.606.836,10.169,10.169,0,0,0,4.133-.824l.388,1.733a8.96,8.96,0,0,1-3.564.958,15.618,15.618,0,0,1-1.672.073,6.288,6.288,0,0,1-2.158-.412,4.692,4.692,0,0,1-1.866-1.212,6.631,6.631,0,0,1-1.466-4.654,6.234,6.234,0,0,1,1.757-4.509,5.974,5.974,0,0,1,4.448-1.818,4.733,4.733,0,0,1,3.5,1.309m-.812,4.425.049-.655a2.885,2.885,0,0,0-1.66-2.945,3.332,3.332,0,0,0-1.334-.242,3.368,3.368,0,0,0-1.43.3,3.514,3.514,0,0,0-1.114.825,4.376,4.376,0,0,0-1.091,2.715Zm5.358-3.624h-1.3v-1.5l2.982-2.242h.618v1.879h3.466v1.866h-3.466v4.9a5.311,5.311,0,0,0,.521,2.812,2.747,2.747,0,0,0,2.036.91l-.351,1.636q-3.636.46-4.3-2.873a10.568,10.568,0,0,1-.206-2.144Z"
                      transform="translate(-262.589 455.303)"
                      fill="#764abc"
                    />
                  </g>
                </g>
              </svg>
            </a>
          </div>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            id="menu-button"
            className="h-6 w-6 cursor-pointer md:hidden block"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>

          <div
            className="hidden w-full md:flex md:items-center md:w-auto gap-x-3"
            id="menu"
          >
            <ul
              className="
              pt-4
              text-base text-gray-700
              md:flex
              md:justify-between 
              md:pt-0 gap-x-3"
            >
              <li>
                <NavLink
                  className={({isActive, isPending}) =>
                    `header-link ${isActive ? "active-link" : ""}`
                  }
                  to="/pdf-tools"
                >
                  Pdf Tools
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={({isActive, isPending}) =>
                    `header-link ${isActive ? "active-link" : ""}`
                  }
                  to="/docx-tools"
                >
                  Docx Tool
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={({isActive, isPending}) =>
                    `header-link ${isActive ? "active-link" : ""}`
                  }
                  to="/image-tools"
                >
                  Image Tools
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={({isActive, isPending}) =>
                    `header-link ${isActive ? "active-link" : ""}`
                  }
                  to="/favicon-maker"
                >
                  Favicon Maker
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={({isActive, isPending}) =>
                    `header-link ${isActive ? "active-link" : ""}`
                  }
                  to="/icon-resizer"
                >
                  Icon Resizer
                </NavLink>
              </li>
            </ul>
          </div>
          <ThemeSwitcher />
        </nav>
      </header>

      {/* ========== END HEADER ========== */}

      <main className="main container mx-auto border-l border-r border-gray-200 dark:border-neutral-700">
        {children}
      </main>
      {/* ========== FOOTER ========== */}
      <hr className="border-gray-200 dark:border-neutral-700" />

      <footer className="mt-auto w-full max-w-340 py-10 px-4 sm:px-6 lg:px-8 mx-auto">
        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-10">
          <div className="col-span-full hidden lg:col-span-1 lg:block">
            <a
              className="flex-none font-semibold text-xl text-black focus:outline-hidden focus:opacity-80 dark:text-white"
              href="#"
              aria-label="Brand"
            >
              Brand
            </a>
            <p className="mt-3 text-xs sm:text-sm text-gray-600 dark:text-neutral-400">
              © 2025 Preline Labs.
            </p>
          </div>
          {/* End Col */}

          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase dark:text-neutral-100">
              Product
            </h4>

            <div className="mt-3 grid space-y-3 text-sm">
              <p>
                <a
                  className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                  href="#"
                >
                  Pricing
                </a>
              </p>
              <p>
                <a
                  className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                  href="#"
                >
                  Changelog
                </a>
              </p>
              <p>
                <a
                  className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                  href="#"
                >
                  Docs
                </a>
              </p>
              <p>
                <a
                  className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                  href="#"
                >
                  Download
                </a>
              </p>
            </div>
          </div>
          {/* End Col */}

          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase dark:text-neutral-100">
              Company
            </h4>

            <div className="mt-3 grid space-y-3 text-sm">
              <p>
                <a
                  className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                  href="#"
                >
                  About us
                </a>
              </p>
              <p>
                <a
                  className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                  href="#"
                >
                  Blog
                </a>
              </p>
              <p>
                <a
                  className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                  href="#"
                >
                  Careers
                </a>{" "}
                <span className="inline text-blue-600 dark:text-blue-500">
                  — We're hiring
                </span>
              </p>
              <p>
                <a
                  className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                  href="#"
                >
                  Customers
                </a>
              </p>
              <p>
                <a
                  className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                  href="#"
                >
                  Newsroom
                </a>
              </p>
              <p>
                <a
                  className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                  href="#"
                >
                  Sitemap
                </a>
              </p>
            </div>
          </div>
          {/* End Col */}

          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase dark:text-neutral-100">
              Resources
            </h4>

            <div className="mt-3 grid space-y-3 text-sm">
              <p>
                <a
                  className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                  href="#"
                >
                  Community
                </a>
              </p>
              <p>
                <a
                  className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                  href="#"
                >
                  Help & Support
                </a>
              </p>
              <p>
                <a
                  className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                  href="#"
                >
                  eBook
                </a>
              </p>
              <p>
                <a
                  className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                  href="#"
                >
                  What's New
                </a>
              </p>
              <p>
                <a
                  className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                  href="#"
                >
                  Status
                </a>
              </p>
            </div>
          </div>
          {/* End Col */}

          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase dark:text-neutral-100">
              Developers
            </h4>

            <div className="mt-3 grid space-y-3 text-sm">
              <p>
                <a
                  className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                  href="#"
                >
                  Api
                </a>
              </p>
              <p>
                <a
                  className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                  href="#"
                >
                  Status
                </a>
              </p>
              <p>
                <a
                  className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                  href="#"
                >
                  GitHub
                </a>{" "}
                <span className="inline text-blue-600 dark:text-blue-500">
                  — New
                </span>
              </p>
            </div>

            <h4 className="mt-7 text-xs font-semibold text-gray-900 uppercase dark:text-neutral-100">
              Industries
            </h4>

            <div className="mt-3 grid space-y-3 text-sm">
              <p>
                <a
                  className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                  href="#"
                >
                  Financial Services
                </a>
              </p>
              <p>
                <a
                  className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                  href="#"
                >
                  Education
                </a>
              </p>
            </div>
          </div>
          {/* End Col */}
        </div>
        {/* End Grid */}

        <div className="pt-5 mt-5 border-t border-gray-200 dark:border-neutral-700">
          <div className="sm:flex sm:justify-between sm:items-center">
            <div className="flex flex-wrap items-center gap-3">
              {/* Language Dropdown */}
              <div className=" [--placement:top-left] relative inline-flex">
                <button
                  type="button"
                  className=" py-2 px-3 inline-flex items-center gap-x-2 text-sm rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                  aria-haspopup="menu"
                  aria-expanded="false"
                  aria-label="Dropdown"
                >
                  <svg
                    className="shrink-0 size-3 rounded-full"
                    xmlns="http://www.w3.org/2000/svg"
                    id="flag-icon-css-us1"
                    viewBox="0 0 512 512"
                  >
                    <g fillRule="evenodd">
                      <g strokeWidth="1pt">
                        <path
                          fill="#bd3d44"
                          d="M0 0h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0z"
                          transform="scale(3.9385)"
                        />
                        <path
                          fill="#fff"
                          d="M0 10h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0z"
                          transform="scale(3.9385)"
                        />
                      </g>
                      <path
                        fill="#192f5d"
                        d="M0 0h98.8v70H0z"
                        transform="scale(3.9385)"
                      />
                      <path
                        fill="#fff"
                        d="M8.2 3l1 2.8H12L9.7 7.5l.9 2.7-2.4-1.7L6 10.2l.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7L74 8.5l-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 7.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0l1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7l.8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 24.2l.9-2.7-2.4-1.7h3zm16.4 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 21.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0l1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7l.8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 38.2l.9-2.7-2.4-1.7h3zm16.4 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 35.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0l1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7l.8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 52.2l.9-2.7-2.4-1.7h3zm16.4 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 49.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0l1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7l.8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 66.2l.9-2.7-2.4-1.7h3zm16.4 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 63.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9z"
                        transform="scale(3.9385)"
                      />
                    </g>
                  </svg>
                  English (US)
                  <svg
                    className=" shrink-0 size-4 text-gray-500 dark:text-neutral-500"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m18 15-6-6-6 6" />
                  </svg>
                </button>

                <div
                  className=" w-40 transition-[opacity,margin] duration  opacity-0 hidden z-10 bg-white shadow-md rounded-lg p-2 dark:bg-neutral-800 dark:border dark:border-neutral-700 dark:divide-neutral-700"
                  role="menu"
                  aria-orientation="vertical"
                >
                  <a
                    className="flex items-center gap-x-2 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700 dark:focus:text-neutral-300"
                    href="#"
                  >
                    <svg
                      className="shrink-0 size-3.5 rounded-full"
                      xmlns="http://www.w3.org/2000/svg"
                      id="flag-icon-css-us"
                      viewBox="0 0 512 512"
                    >
                      <g fillRule="evenodd">
                        <g strokeWidth="1pt">
                          <path
                            fill="#bd3d44"
                            d="M0 0h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0z"
                            transform="scale(3.9385)"
                          />
                          <path
                            fill="#fff"
                            d="M0 10h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0z"
                            transform="scale(3.9385)"
                          />
                        </g>
                        <path
                          fill="#192f5d"
                          d="M0 0h98.8v70H0z"
                          transform="scale(3.9385)"
                        />
                        <path
                          fill="#fff"
                          d="M8.2 3l1 2.8H12L9.7 7.5l.9 2.7-2.4-1.7L6 10.2l.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7L74 8.5l-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 7.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0l1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7l.8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 24.2l.9-2.7-2.4-1.7h3zm16.4 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 21.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0l1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7l.8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 38.2l.9-2.7-2.4-1.7h3zm16.4 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 35.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0l1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7l.8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 52.2l.9-2.7-2.4-1.7h3zm16.4 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 49.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0l1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7l.8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 66.2l.9-2.7-2.4-1.7h3zm16.4 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 63.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9z"
                          transform="scale(3.9385)"
                        />
                      </g>
                    </svg>
                    English (US)
                  </a>
                  <a
                    className="flex items-center gap-x-2 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700 dark:focus:text-neutral-300"
                    href="#"
                  >
                    <svg
                      className="shrink-0 size-3 rounded-full"
                      xmlns="http://www.w3.org/2000/svg"
                      id="flag-icon-css-de"
                      viewBox="0 0 512 512"
                    >
                      <path fill="#ffce00" d="M0 341.3h512V512H0z" />
                      <path d="M0 0h512v170.7H0z" />
                      <path fill="#d00" d="M0 170.7h512v170.6H0z" />
                    </svg>
                    Deutsch
                  </a>
                  <a
                    className="flex items-center gap-x-2 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700 dark:focus:text-neutral-300"
                    href="#"
                  >
                    <svg
                      className="shrink-0 size-3 rounded-full"
                      xmlns="http://www.w3.org/2000/svg"
                      id="flag-icon-css-dk"
                      viewBox="0 0 512 512"
                    >
                      <path fill="#c8102e" d="M0 0h512.1v512H0z" />
                      <path fill="#fff" d="M144 0h73.1v512H144z" />
                      <path fill="#fff" d="M0 219.4h512.1v73.2H0z" />
                    </svg>
                    Dansk
                  </a>
                  <a
                    className="flex items-center gap-x-2 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700 dark:focus:text-neutral-300"
                    href="#"
                  >
                    <svg
                      className="shrink-0 size-3 rounded-full"
                      xmlns="http://www.w3.org/2000/svg"
                      id="flag-icon-css-it"
                      viewBox="0 0 512 512"
                    >
                      <g fillRule="evenodd" strokeWidth="1pt">
                        <path fill="#fff" d="M0 0h512v512H0z" />
                        <path fill="#009246" d="M0 0h170.7v512H0z" />
                        <path fill="#ce2b37" d="M341.3 0H512v512H341.3z" />
                      </g>
                    </svg>
                    Italiano
                  </a>
                  <a
                    className="flex items-center gap-x-2 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700 dark:focus:text-neutral-300"
                    href="#"
                  >
                    <svg
                      className="shrink-0 size-3 rounded-full"
                      xmlns="http://www.w3.org/2000/svg"
                      id="flag-icon-css-cn"
                      viewBox="0 0 512 512"
                    >
                      <defs>
                        <path
                          id="a"
                          fill="#ffde00"
                          d="M1-.3L-.7.8 0-1 .6.8-1-.3z"
                        />
                      </defs>
                      <path fill="#de2910" d="M0 0h512v512H0z" />
                      <use
                        width="30"
                        height="20"
                        transform="matrix(76.8 0 0 76.8 128 128)"
                      />
                      <use
                        width="30"
                        height="20"
                        transform="rotate(-121 142.6 -47) scale(25.5827)"
                      />
                      <use
                        width="30"
                        height="20"
                        transform="rotate(-98.1 198 -82) scale(25.6)"
                      />
                      <use
                        width="30"
                        height="20"
                        transform="rotate(-74 272.4 -114) scale(25.6137)"
                      />
                      <use
                        width="30"
                        height="20"
                        transform="matrix(16 -19.968 19.968 16 256 230.4)"
                      />
                    </svg>
                    中文 (繁體)
                  </a>
                </div>
              </div>
              {/* End Language Dropdown */}

              <div className="space-x-4 text-sm">
                <a
                  className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                  href="#"
                >
                  Terms
                </a>
                <a
                  className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                  href="#"
                >
                  Privacy
                </a>
                <a
                  className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                  href="#"
                >
                  Status
                </a>
              </div>
            </div>

            <div className="flex flex-wrap justify-between items-center gap-3">
              <div className="mt-3 sm:hidden">
                <a
                  className="flex-none font-semibold text-xl text-black focus:outline-hidden focus:opacity-80 dark:text-white"
                  href="#"
                  aria-label="Brand"
                >
                  Brand
                </a>
                <p className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-neutral-400">
                  © 2025 Preline Labs.
                </p>
              </div>

              {/* Social Brands */}
              <div className="space-x-4">
                <a
                  className="inline-block text-gray-500 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-500 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                  href="#"
                >
                  <svg
                    className="shrink-0 size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                  </svg>
                </a>
                <a
                  className="inline-block text-gray-500 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-500 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                  href="#"
                >
                  <svg
                    className="shrink-0 size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                </a>
                <a
                  className="inline-block text-gray-500 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-500 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                  href="#"
                >
                  <svg
                    className="shrink-0 size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M3.362 10.11c0 .926-.756 1.681-1.681 1.681S0 11.036 0 10.111C0 9.186.756 8.43 1.68 8.43h1.682v1.68zm.846 0c0-.924.756-1.68 1.681-1.68s1.681.756 1.681 1.68v4.21c0 .924-.756 1.68-1.68 1.68a1.685 1.685 0 0 1-1.682-1.68v-4.21zM5.89 3.362c-.926 0-1.682-.756-1.682-1.681S4.964 0 5.89 0s1.68.756 1.68 1.68v1.682H5.89zm0 .846c.924 0 1.68.756 1.68 1.681S6.814 7.57 5.89 7.57H1.68C.757 7.57 0 6.814 0 5.89c0-.926.756-1.682 1.68-1.682h4.21zm6.749 1.682c0-.926.755-1.682 1.68-1.682.925 0 1.681.756 1.681 1.681s-.756 1.681-1.68 1.681h-1.681V5.89zm-.848 0c0 .924-.755 1.68-1.68 1.68A1.685 1.685 0 0 1 8.43 5.89V1.68C8.43.757 9.186 0 10.11 0c.926 0 1.681.756 1.681 1.68v4.21zm-1.681 6.748c.926 0 1.682.756 1.682 1.681S11.036 16 10.11 16s-1.681-.756-1.681-1.68v-1.682h1.68zm0-.847c-.924 0-1.68-.755-1.68-1.68 0-.925.756-1.681 1.68-1.681h4.21c.924 0 1.68.756 1.68 1.68 0 .926-.756 1.681-1.68 1.681h-4.21z" />
                  </svg>
                </a>
              </div>
              {/* End Social Brands */}
            </div>
            {/* End Col */}
          </div>
        </div>
      </footer>
      {/* ========== END FOOTER ========== */}
    </>
  );
};
export default Layout;
