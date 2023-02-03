import { Banner, Box } from "@shopify/polaris";
import { memo } from "react";

export default memo(() => (
  <Box paddingBlockEnd="4">
    <Banner title="Tilføj staff til produktet" status="warning">
      <p>
        Før denne service kan aktiveres, skal du først tilføje medarbejder til
        produktet
      </p>
    </Banner>
  </Box>
));
