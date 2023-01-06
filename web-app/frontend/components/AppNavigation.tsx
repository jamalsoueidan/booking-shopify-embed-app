import { Navigation } from "@shopify/polaris";
import { HomeMajor, OrdersMajor } from "@shopify/polaris-icons";

export const AppNavigation = () => {
  return (
    <Navigation location="/">
      <Navigation.Section
        title="Jaded Pixel App"
        items={[
          {
            label: "Dashboard",
            icon: HomeMajor,
          },
          {
            label: "Jaded Pixel Orders",
            icon: OrdersMajor,
          },
        ]}
      />
    </Navigation>
  );
};
