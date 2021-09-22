/**
 * 操作权限处理
 * Copyright (c) 2020
 */
export default {
  inserted(el, binding) {
    const { value } = binding;
    const all_permission = "*:*:*";
    // // 判断数组里是否有"*:*:*"，如果无进行存储
    const permissions = JSON.parse(sessionStorage.getItem("permissions"));
    if (value && value instanceof Array && value.length > 0) {
      const permissionFlag = value;
      const hasPermissions = permissions.some((permission) => {
        return (
          all_permission === permission || permissionFlag.includes(permission)
        );
      });
      if (!hasPermissions) {
        if (el.getAttribute("permsId") != null) {
          el.parentNode && el.parentNode.removeChild(el);
        } else {
          el.parentNode && el.parentNode.removeChild(el);
        }
      }
    } else {
      throw new Error(`请设置操作权限标签值`);
    }
  },
};
