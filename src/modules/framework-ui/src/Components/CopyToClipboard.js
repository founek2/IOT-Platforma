import Tooltip, { TooltipProps } from "@material-ui/core/Tooltip";
import copy from "clipboard-copy";
import React, { useState } from "react";

function CopyToClipboard({ TooltipProps, children }) {
  const [showTooltip, setShowTooltip] = useState(false)


  return (
    <Tooltip
      open={showTooltip}
      title={"Copied to clipboard!"}
      leaveDelay={1500}
      onClose={() => setShowTooltip(false)}
      {...TooltipProps || {}}
    >
      {children({
        copy: (content) => {
          copy(content);
          setShowTooltip( true );
        }
      })}
    </Tooltip>
  );
}

export default CopyToClipboard;
