import {MegaMenu} from "./megamenu";

/**
 * Example: How to use the MegaMenu component in your layout
 *
 * Features:
 * - Responsive navigation with mega menu support
 * - Mobile sidebar with slide-in animation
 * - Dark mode toggle with localStorage persistence
 * - Multi-level submenus (text columns and image cards)
 * - Click-outside to close menu
 * - Auto-close on window resize
 */

export const NavigationExample = () => {
  // Optional: Pass your own brand logo
  const brandLogo = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="512"
      height="512"
      viewBox="0 0 192.756 192.756"
    >
      {/* Your SVG content here */}
    </svg>
  );

  return (
    <div>
      {/* Use without custom logo (uses default) */}
      <MegaMenu />

      {/* Or use with custom logo */}
      {/* <MegaMenu brandLogo={brandLogo} /> */}

      {/* Rest of your page content */}
      <main style={{paddingTop: "100px"}}>{/* Your content here */}</main>
    </div>
  );
};
