import { memo } from "react";
import { Redirect } from "react-router-dom";

import usePermissions from "../hooks/permissions.hook";

/**
 * The permission component allows you to only display
 * content to users that have the required permissions.
 * It can be used in two ways. First one is wrapping the
 * content that is restricted, and using it as a HOC. The
 * second way, is to use the hasPermission function, to then
 * enable or disable buttons, for example.
 */
const Permission = ({
     requiredPermissions,
     hasAll,
     children,
     redirectTo,
     fallback,
}) => {
     const { allowed } = usePermissions(requiredPermissions, hasAll);

     /**
      * In case there is more than one child element, we need
      * to wrap the whole thing in a fragment.
      */
     if (allowed) return <>{children}</>;
     if (redirectTo) return <Redirect to={redirectTo} />;
     if (fallback) return <>{fallback}</>;
     return null;
};

export default memo(Permission);
