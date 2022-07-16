/**
 * Example problem with existing solution and passing test.
 * See problem 0 in the spec file for the assertion
 * @returns {string}
 */
exports.example = () => "hello world";

exports.stripPrivateProperties = (propertiesAsStringArray, objectsAsArray) => {
  // define result
  let result = [];
  if (
    Array.isArray(propertiesAsStringArray) &&
    propertiesAsStringArray.length > 0 &&
    Array.isArray(objectsAsArray) &&
    objectsAsArray.length > 0
  ) {
    // iterate objects
    result = objectsAsArray.map((object) => {
      // define rew object
      const newObject = {};
      for (let index = 0; index < propertiesAsStringArray.length; index++) {
        // iterate keys of object
        Object.keys(object).forEach((key) => {
          if (!propertiesAsStringArray.includes(key)) {
            // add propery and value into the new object
            newObject[key] = object[key];
          }
        });
      }
      return newObject;
    });
  }

  // return
  return result;
};
exports.excludeByProperty = (propertyAsString, objectsAsArray) => {
  // define result
  let result = [];
  if (
    typeof propertyAsString == "string" &&
    Array.isArray(objectsAsArray) &&
    objectsAsArray.length > 0
  ) {
    result = objectsAsArray.filter(
      (object) => object[propertyAsString] == undefined
    );
  }

  // return
  return result;
};
exports.sumDeep = (array) => {
  // define result
  let result = [];
  if (Array.isArray(array) && array.length > 0) {
    // reduce array to result
    result = array.map(({ objects }) => {
      if (Array.isArray(objects) && objects.length > 0) {
        // use reduce
        return {
          objects: objects.reduce((sum, object) => sum + (object.val || 0), 0),
        };
      } else {
        return { objects: 0 };
      }
    });
  }

  // return
  return result;
};
exports.applyStatusColor = (colorVsStatusArrayMappings, statusObjectArray) => {
  // convert colorVsStatusArrayMappings to statusVsColorMappings, although use more space but we got O(1) when lookup color by status
  const statusVsColorMappings = {};
  Object.keys(colorVsStatusArrayMappings).forEach((color) => {
    const statusArray = colorVsStatusArrayMappings[color];
    if (Array.isArray(statusArray) && statusArray.length > 0) {
      statusArray.forEach((s) => (statusVsColorMappings[s] = color));
    }
  });
  //
  if (Array.isArray(statusObjectArray) && statusObjectArray.length > 0) {
    // filter and map
    return statusObjectArray
      .filter(
        (statusObject) => statusVsColorMappings[statusObject.status] != null
      )
      .map((statusObject) => ({
        status: statusObject.status,
        color: statusVsColorMappings[statusObject.status],
      }));
  } else {
    // return empty array
    return [];
  }
};
exports.createGreeting = (greatingFunction, greating) => {
  // return an adapter function
  return (userName) => greatingFunction(greating, userName);
};
exports.setDefaults = (defaultObject) => {
  return (object) => {
    if (object != null) {
      if (defaultObject != null) {
        // find default properties that passed object does not contains, and give them default value
        Object.keys(defaultObject).forEach((key) => {
          if (object[key] == undefined) {
            // set default value
            object[key] = defaultObject[key];
          }
        });
      }
      return object;
    } else {
      // if passed object is null, return a new object with default values
      return Object.assign({}, defaultObject == null ? {} : defaultObject);
    }
  };
};
exports.fetchUserByNameAndUsersCompany = (
  username,
  { fetchStatus, fetchUsers, fetchCompanyById }
) => {
  // method 1:
  //   return Promise.all([fetchUsers(), fetchStatus()]).then(([users, status]) => {
  //     const user = users.find((user) => user.name == username);
  //     const { companyId } = user;
  //     return fetchCompanyById(companyId).then((company) => ({
  //       company,
  //       status,
  //       user,
  //     }));
  //   });
  //
  // method 2, faster than method 1 if we konw each rt exactly
  const statusContainer = { stauts: null };
  fetchStatus().then((stauts) => {
    statusContainer.stauts = stauts;
  });
  return fetchUsers().then((users) => {
    const user = users.find((user) => user.name == username);
    const { companyId } = user;
    return fetchCompanyById(companyId).then((company) => ({
      company,
      status: statusContainer.stauts,
      user,
    }));
  });
};
