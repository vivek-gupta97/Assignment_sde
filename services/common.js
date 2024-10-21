const sequelize = require('sequelize');

/**
 * Retrieves a list of records from a model with pagination and sorting options.
 * @param {Object} model - The model to retrieve records from.
 * @param {Object} condition - The condition to filter the records.
 * @param {Array} attributes - The attributes to include in the result.
 * @param {number} limit - The maximum number of records to retrieve.
 * @param {number} offset - The number of records to skip.
 * @param {Array} order - The order in which the records should be sorted.
 * @returns {Promise<Array|boolean>} - The list of records or false if an error occurs.
 */

exports.getList = async (model, condition, attributes, limit, offset, order) => {
  try {
    const list = await model.findAndCountAll({
      ...condition !== undefined && {
        where: condition
      },
      ...attributes !== undefined && {
        attributes
      },
      ...limit !== undefined && {
        limit
      },
      ...offset !== undefined && {
        offset
      },
      ...order !== undefined && {
        order
      }

    });
    return list ? JSON.parse(JSON.stringify(list)) : false;
  } catch (error) {
    return false;
  }
};

/**
 * Retrieves a list of distinct records from a model with pagination and sorting options.
 * @param {Object} model - The model to retrieve records from.
 * @param {Object} condition - The condition to filter the records.
 * @param {Array} attributes - The attributes to include in the result.
 * @param {number} limit - The maximum number of records to retrieve.
 * @param {number} offset - The number of records to skip.
 * @param {Array} order - The order in which the records should be sorted.
 * @returns {Promise<Array|boolean>} - The list of records or false if an error occurs.
 */

exports.getDistinct = async (model, condition, attributes, group) => {
  try {
    const list = await model.findAll({
      ...condition !== undefined && {
        where: condition
      },
      ...attributes !== undefined && {
        attributes
      },
      ...group !== undefined && {
        group
      }

    });
    return list ? JSON.parse(JSON.stringify(list)) : false;
  } catch (error) {
    return false;
  }
};

exports.getList2 = async (model, model1, condition, condition1, attributes, attributes1, limit, offset, order) => {
  try {
    const list = await model.findAndCountAll({
      ...(condition !== undefined && { where: condition }),
      ...(attributes !== undefined && { attributes }),
      include: [
        {
          model: model1,
          where: sequelize.literal(`${model.name}.created_by = "Users"."id"`),
          ...(condition1 !== undefined && { where: condition1 }),
          ...(attributes1 !== undefined && { attributes: attributes1 }),
          required: false
        },
      ],
      ...(limit !== undefined && { limit }),
      ...(offset !== undefined && { offset }),
      ...(order !== undefined && { order }),
      subQuery: false
    });
    return list ? JSON.parse(JSON.stringify(list)) : false;
  } catch (error) {
    console.log("eeeeeeee", error);
    return false;
  }
};



/**
 * Creates a new record in a model.
 * @param {Object} model - The model to create a record in.
 * @param {Object} data - The data for the new record.
 * @param {Object} transaction - The transaction object for the database operation.
 * @returns {Promise<Object|boolean>} - The created record or false if an error occurs.
 */
exports.addDetail = async (model, data, transaction) => {
  try {
    const addAuthInfo = await model.create(data, { transaction });

    return addAuthInfo ? JSON.parse(JSON.stringify(addAuthInfo)) : false;
  } catch (error) {
    console.log("🚀 ~ file: common.js:36 ~ exports.addDetail= ~ error:", error)
    return false;
  }
};

/**
 * Creates multiple records in a model.
 * @param {Object} model - The model to create records in.
 * @param {Array} data - The data for the new records.
 * @param {Object} transaction - The transaction object for the database operation.
 * @returns {Promise<Array|boolean>} - The created records or false if an error occurs.
 */
exports.bulkAdd = async (model, data, transaction) => {
  try {
    const bulkData = await model.bulkCreate(data, { transaction });

    return bulkData ? JSON.parse(JSON.stringify(bulkData)) : false;
  } catch (error) {
    console.log(">>>>>>>error", error);
    return false;
  }
}

/**
 * Updates bulk records in a model.
 * @param {Object} model - The model to update records in.
 * @param {Array} data - The data for the records to update.
 * @param {Object} condition - The condition to identify the records to update.
 * @param {Object} transaction - The transaction object for the database operation.
 * @returns {Promise<Array|boolean>} - The updated records or false if an error occurs.
 */
exports.bulkUpdate = async (model, data, transaction) => {
  try {
    const bulkData = await model.bulkCreate(data, { updateOnDuplicate: ['id'], transaction });

    return bulkData ? JSON.parse(JSON.stringify(bulkData)) : false;
  } catch (error) {
    console.log(">>>>>>>error", error);
    return false;
  }
}

/**
 * Updates a record in a model based on a condition.
 * @param {Object} model - The model to update a record in.
 * @param {Object} data - The updated data for the record.
 * @param {Object} condition - The condition to identify the record to update.
 * @param {Object} transaction - The transaction object for the database operation.
 * @returns {Promise<Object|boolean>} - The updated record or false if an error occurs.
 */
exports.updateData = async (model, data, condition, transaction) => {
  try {
    const result = await model.update(data, { where: condition, transaction, returning: true, plain: true });
    return result ? JSON.parse(JSON.stringify(result)) : false;
  } catch (error) {
    console.log('errrror>>>>>>>', error);
    return false;
  }
};

/**
 * Retrieves a single record from a model based on a condition.
 * @param {Object} model - The model to retrieve a record from.
 * @param {Object} condition - The condition to filter the record.
 * @param {Array} attributes - The attributes to include in the result.
 * @returns {Promise<Object|boolean>} - The retrieved record or false if an error occurs.
 */
exports.findByCondition = async (model, condition, attributes) => {
  try {
    const data = await model.findOne({
      where: condition,
      ...attributes !== undefined && {
        attributes
      },
    });
    return data ? JSON.parse(JSON.stringify(data)) : false;
  } catch (error) {
    return false;
  }
};

/**
 * Deletes a record from a model based on a condition.
 * @param {Object} model - The model to delete a record from.
 * @param {Object} condition - The condition to identify the record to delete.
 * @param {Object} transaction - The transaction object for the database operation.
 * @param {boolean} [force=false] - Whether to force the deletion or not.
 * @returns {Promise<number|boolean>} - The number of deleted records or false if an error occurs.
 */
exports.deleteQuery = async (model, condition, transaction, force = false) => {
  try {
    const data = await model.destroy(
      { where: condition, transaction, force },
      // { transaction }
    );

    return data ? JSON.parse(JSON.stringify(data)) : false;
  } catch (error) {
    return false;
  }
};

/**
 * Counts the number of records in a model based on a condition.
 * @param {Object} model - The model to count records in.
 * @param {Object} condition - The condition to filter the records.
 * @returns {Promise<number|boolean>} - The total number of records or false if an error occurs.
 */
exports.count = async (model, condition) => {
  try {
    const total = await model.count({ where: condition });
    return total ? JSON.parse(JSON.stringify(total)) : 0;
  } catch (error) {
    return false;
  }
};

/**
 * Retrieves a list of records from a model with two associated models, with pagination and sorting options.
 * @param {Object} model - The main model to retrieve records from.
 * @param {Object} model1 - The first associated model.
 * @param {Object} model2 - The second associated model.
 * @param {Object} condition - The condition to filter the records.
 * @param {Object} condition1 - The condition to filter the first associated model records.
 * @param {Object} condition2 - The condition to filter the second associated model records.
 * @param {Array} attributes - The attributes to include in the result.
 * @param {Array} attributes1 - The attributes to include in the result of the first associated model.
 * @param {Array} attributes2 - The attributes to include in the result of the second associated model.
 * @param {number} limit - The maximum number of records to retrieve.
 * @param {number} offset - The number of records to skip.
 * @param {Array} order - The order in which the records should be sorted.
 * @returns {Promise<Array|boolean>} - The list of records or false if an error occurs.
 */
exports.getListWithMultiAssociate = async (model, model1, model2, condition, condition1, condition2, attributes, attributes1, attributes2, limit, offset, order) => {
  try {
    let list = await model.findAndCountAll({
      ...condition !== undefined && {
        where: condition
      },
      ...attributes !== undefined && {
        attributes
      },
      include: [
        {
          model: model1,
          ...condition1 !== undefined && {
            where: condition1
          },
          ...attributes1 !== undefined && {
            attributes: attributes1
          },
          required: true
        },
        {
          model: model2,
          ...condition2 !== undefined && {
            where: condition2
          },
          ...attributes2 !== undefined && {
            attributes: attributes2
          },
          required: true
        },
      ],
      ...limit !== undefined && {
        limit
      },
      ...offset !== undefined && {
        offset
      },
      ...order !== undefined && {
        order
      },
    });
    return list ? JSON.parse(JSON.stringify(list)) : false;

  } catch (error) {
    console.log("eeeeeeee", error)
    return false
  }
};

/**
 * Retrieves a list of records from a model without counting the total number of records.
 * @param {Object} model - The model to retrieve records from.
 * @param {Object} condition - The condition to filter the records.
 * @param {Array} attributes - The attributes to include in the result.
 * @param {number} limit - The maximum number of records to retrieve.
 * @param {number} offset - The number of records to skip.
 * @param {Array} order - The order in which the records should be sorted.
 * @returns {Promise<Array|boolean>} - The list of records or false if an error occurs.
 */
exports.getListWithoutCount = async (model, condition, attributes, limit, offset, order) => {
  try {
    let list = await model.findAll({
      ...condition !== undefined && {
        where: condition
      },
      // attributes: {
      //   ...(attributes !== undefined && { include: attributes }),
      //   exclude: ['createdAt', 'updatedAt', 'deletedAt']
      // },
      ...attributes !== undefined && {
        attributes
      },
      ...limit !== undefined && {
        limit
      },
      ...offset !== undefined && {
        offset
      },
      ...order !== undefined && {
        order
      },

    });
    return list ? JSON.parse(JSON.stringify(list)) : false;

  } catch (error) {
    console.log('erro', error);
    return false
  }
};

/**
 * Retrieves a list of records from a model with an associated model without counting the total number of records.
 * @param {Object} model - The main model to retrieve records from.
 * @param {Object} model1 - The associated model.
 * @param {Object} condition - The condition to filter the records.
 * @param {Object} condition1 - The condition to filter the associated model records.
 * @param {Array} attributes - The attributes to include in the result.
 * @param {Array} attributes1 - The attributes to include in the result of the associated model.
 * @param {number} limit - The maximum number of records to retrieve.
 * @param {number} offset - The number of records to skip.
 * @param {Array} order - The order in which the records should be sorted.
 * @returns {Promise<Array|boolean>} - The list of records or false if an error occurs.
 */
exports.getListAssociateWithoutCount = async (model, model1, condition, condition1, attributes, attributes1, limit, offset, order) => {
  try {
    let list = await model.findAll({
      ...condition !== undefined && {
        where: condition
      },
      ...attributes !== undefined && {
        attributes
      },
      include: {
        model: model1,
        ...condition1 !== undefined && {
          where: condition1
        },
        ...attributes1 !== undefined && {
          attributes: attributes1
        },
        required: false // left join
      },
      ...limit !== undefined && {
        limit
      },
      ...offset !== undefined && {
        offset
      },
      ...order !== undefined && {
        order
      },
      // distinct: true
    });
    return list ? JSON.parse(JSON.stringify(list)) : false;

  } catch (error) {
    console.log('erro', error);
    return false
  }
};

exports.getListAssociateWithoutCountWithAlias = async (model, model1,alias1, condition, condition1, attributes, attributes1, limit, offset, order) => {
  try {
    let list = await model.findAll({
      ...condition !== undefined && {
        where: condition
      },
      ...attributes !== undefined && {
        attributes
      },
      include: {
        model: model1,
        as: alias1,
        ...condition1 !== undefined && {
          where: condition1
        },
        ...attributes1 !== undefined && {
          attributes: attributes1
        },
        required: false // left join
      },
      ...limit !== undefined && {
        limit
      },
      ...offset !== undefined && {
        offset
      },
      ...order !== undefined && {
        order
      },

    });
    return list ? JSON.parse(JSON.stringify(list)) : false;

  } catch (error) {
    console.log('erro', error);
    return false
  }
};

/**
 * Retrieves a single record from a model with an associated model.
 * @param {Object} model - The main model to retrieve a record from.
 * @param {Object} model1 - The associated model.
 * @param {Object} condition - The condition to filter the record.
 * @param {Object} condition1 - The condition to filter the associated model record.
 * @param {Array} attributes - The attributes to include in the result.
 * @param {Array} attributes1 - The attributes to include in the result of the associated model.
 * @param {number} limit - The maximum number of records to retrieve.
 * @param {number} offset - The number of records to skip.
 * @param {Array} order - The order in which the records should be sorted.
 * @returns {Promise<Object|boolean>} - The retrieved record or false if an error occurs.
 */
exports.getDataAssociate = async (model, model1, condition, condition1, attributes, attributes1, limit, offset, order) => {
  try {
    let list = await model.findOne({
      ...condition !== undefined && {
        where: condition
      },
      ...attributes !== undefined && {
        attributes
      },
      include: {
        model: model1,
        ...condition1 !== undefined && {
          where: condition1
        },
        ...attributes1 !== undefined && {
          attributes: attributes1
        },
        required: true
      },
      ...limit !== undefined && {
        limit
      },
      ...offset !== undefined && {
        offset
      },
      ...order !== undefined && {
        order
      },
      
    });
    return list ? JSON.parse(JSON.stringify(list)) : false;

  } catch (error) {
    console.log('erro', error);
    return false
  }
};

/**
 * Retrieves a list of records from a model with an associated model.
 * @param {Object} model - The main model to retrieve records from.
 * @param {Object} model1 - The associated model.
 * @param {Object} condition - The condition to filter the records.
 * @param {Object} condition1 - The condition to filter the associated model records.
 * @param {Array} attributes - The attributes to include in the result.
 * @param {Array} attributes1 - The attributes to include in the result of the associated model.
 * @param {number} limit - The maximum number of records to retrieve.
 * @param {number} offset - The number of records to skip.
 * @param {Array} order - The order in which the records should be sorted.
 * @returns {Promise<Array|boolean>} - The list of records or false if an error occurs.
 */
exports.getListAssociate = async (model, model1, condition, condition1, attributes, attributes1, limit, offset, order) => {
  try {
    let list = await model.findAll({
      ...condition !== undefined && {
        where: condition
      },
      ...attributes !== undefined && {
        attributes
      },
      include: {
        model: model1,
        ...condition1 !== undefined && {
          where: condition1
        },
        ...attributes1 !== undefined && {
          attributes: attributes1
        },
        required: true
      },
      ...limit !== undefined && {
        limit
      },
      ...offset !== undefined && {
        offset
      },
      ...order !== undefined && {
        order
      },

    });
    return list ? JSON.parse(JSON.stringify(list)) : false;

  } catch (error) {
    console.log('erro', error);
    return false
  }
};

exports.getListAssociateWithAlias = async (model, model1, alias1, condition, condition1, attributes, attributes1, limit, offset, order) => {
  try {
    let list = await model.findAll({
      ...condition !== undefined && {
        where: condition
      },
      ...attributes !== undefined && {
        attributes
      },
      include: {
        model: model1,
        as: alias1,
        ...condition1 !== undefined && {
          where: condition1
        },
        ...attributes1 !== undefined && {
          attributes: attributes1
        },
        required: true
      },
      ...limit !== undefined && {
        limit
      },
      ...offset !== undefined && {
        offset
      },
      ...order !== undefined && {
        order
      },

    });
    return list ? JSON.parse(JSON.stringify(list)) : false;

  } catch (error) {
    console.log('erro', error);
    return false
  }
};

/**
 * Retrieves a list of records from a model with a group by clause.
 * @param {Object} model - The model to retrieve records from.
 * @param {Object} condition - The condition to filter the records.
 * @param {Array} attributes - The attributes to include in the result.
 * @param {number} limit - The maximum number of records to retrieve.
 * @param {number} offset - The number of records to skip.
 * @param {Array} order - The order in which the records should be sorted.
 * @returns {Promise<Array|boolean>} - The list of records or false if an error occurs.
 */
exports.getListWithGroup = async (model, condition, attributes, limit, offset, order) => {
  try {
    let list = await model.findAll({
      ...condition !== undefined && {
        where: condition
      },
      ...attributes !== undefined && {
        attributes
      },
      group: ['role_id'],
      ...limit !== undefined && {
        limit
      },
      ...offset !== undefined && {
        offset
      },
      ...order !== undefined && {
        order
      },

    });
    return list ? JSON.parse(JSON.stringify(list)) : false;

  } catch (error) {
    console.log('erro', error);
    return false
  }
};

exports.getListAssociateWithGroup = async (model, model1, condition, condition1, attributes, attributes1, limit, offset, order) => {
  try {
    const list = await model.findAll({
      ...condition !== undefined && {
        where: condition
      },
      ...attributes !== undefined && {
        attributes
      },
      include: {
        model: model1,
        ...condition1 !== undefined && {
          where: condition1
        },
        ...attributes1 !== undefined && {
          attributes: attributes1
        },
        required: false // left join
      },
      group: ['Departments.id'],
      ...limit !== undefined && {
        limit
      },
      ...offset !== undefined && {
        offset
      },
      ...order !== undefined && {
        order
      },

    });
    return list ? JSON.parse(JSON.stringify(list)) : false;

  } catch (error) {
    console.log('erro', error);
    return false
  }
};


exports.listGroupBy = async (model, model1, condition, condition1, attributes, groupBy) => {
  try {
    const data = await model.findAll({
      ...attributes !== undefined && {
        attributes
      },
      include: [
        {
          model: model1,
          where: condition1,
          attributes: []
        }
      ],
      ...condition !== undefined && {
        where: condition
      },
      group: groupBy,
      raw: true
    });
    return data ? JSON.parse(JSON.stringify(data)) : false;
  } catch (error) {
    console.log('erro', error);
    return false;
  }
};


exports.getListGroupBy = async (model, condition, attributes, groupBy) => {
  try {
    let list = await model.findAll({
      where: condition,
      attributes: attributes ? attributes : ['status', [sequelize.fn('COUNT', 'id'), 'count']],
      group: groupBy ? groupBy : ['status']
    });
    return list ? JSON.parse(JSON.stringify(list)) : false;
  } catch (error) {
    console.log('error', error);
    return false;
  }
};

exports.getGroupHierarchy = async (db, group_id) => {
  try {
    const results = await db.query(`
    WITH RECURSIVE GroupHierarchy AS (
      SELECT id, parent_id
      FROM "group"
      WHERE id = :entity_id

      UNION ALL

      SELECT g.id, g.parent_id
      FROM "group" AS g
      INNER JOIN GroupHierarchy AS gh ON g.parent_id = gh.id
    )
    SELECT id FROM GroupHierarchy;
    `, {
      replacements: { entity_id: group_id },
      type: sequelize.QueryTypes.SELECT
    });

    return results ? JSON.parse(JSON.stringify(results)) : false;
  } catch (error) {
    console.error(error);
    return false;
  }
}

// core engine

/**
 * Retrieves a list of records from a model with two associated models, with pagination and sorting options.
 * @param {Object} model - The main model to retrieve records from.
 * @param {Object} model1 - The first associated model.
 * @param {Object} model2 - The second associated model.
 * @param {Object} condition - The condition to filter the records.
 * @param {Object} condition1 - The condition to filter the first associated model records.
 * @param {Object} condition2 - The condition to filter the second associated model records.
 * @param {Array} attributes - The attributes to include in the result.
 * @param {Array} attributes1 - The attributes to include in the result of the first associated model.
 * @param {Array} attributes2 - The attributes to include in the result of the second associated model.
 * @param {number} limit - The maximum number of records to retrieve.
 * @param {number} offset - The number of records to skip.
 * @param {Array} order - The order in which the records should be sorted.
 * @returns {Promise<Array|boolean>} - The list of records or false if an error occurs.
 */
exports.getListWithInnerAssociate = async (model, model1, model2, condition, condition1, condition2, attributes, attributes1, attributes2, limit, offset, order) => {
  try {
    let list = await model.findAndCountAll({
      ...condition !== undefined && {
        where: condition
      },
      ...attributes !== undefined && {
        attributes
      },
      include: [
        {
          model: model1,
          ...condition1 !== undefined && {
            where: condition1
          },
          ...attributes1 !== undefined && {
            attributes: attributes1
          },
          required: true,
          include: [
            {
              model: model2,
              ...condition2 !== undefined && {
                where: condition2
              },
              ...attributes2 !== undefined && {
                attributes: attributes2
              },
              required: true
            },
          ]
        }
      ],
      ...limit !== undefined && {
        limit
      },
      ...offset !== undefined && {
        offset
      },
      ...order !== undefined && {
        order
      },
      subQuery: false
    });
    return list ? JSON.parse(JSON.stringify(list)) : false;

  } catch (error) {
    console.log("eeeeeeee", error)
    return false
  }
};

exports.getListWithMultipleAssociate = async (model, model1, model2, model3, condition, condition1, condition2, condition3, attributes, attributes1, attributes2, attributes3, limit, offset, order) => {
  try {
    let list = await model.findAndCountAll({
      ...condition !== undefined && {
        where: condition
      },
      ...attributes !== undefined && {
        attributes
      },
      include: [
        {
          model: model1,
          ...condition1 !== undefined && {
            where: condition1
          },
          ...attributes1 !== undefined && {
            attributes: attributes1
          },
          required: false
        },
        {
          model: model2,
          ...condition2 !== undefined && {
            where: condition2
          },
          ...attributes2 !== undefined && {
            attributes: attributes2
          },
          required: false
        },
        {
          model: model3,
          ...condition3 !== undefined && {
            where: condition3
          },
          ...attributes3 !== undefined && {
            attributes: attributes3
          },
          required: false
        },
      ],
      ...limit !== undefined && {
        limit
      },
      ...offset !== undefined && {
        offset
      },
      ...order !== undefined && {
        order
      },
    });
    return list ? JSON.parse(JSON.stringify(list)) : false;

  } catch (error) {
    console.log("eeeeeeee", error)
    return false
  }
};

exports.getListWithoutCount1 = async (model, condition, attributes, limit, offset, order) => {
  try {
    let list = await model.findAll({
      ...condition !== undefined && {
        where: condition
      },
      ...attributes !== undefined && {
        attributes
      },
      ...limit !== undefined && {
        limit
      },
      ...offset !== undefined && {
        offset
      },
      ...order !== undefined && {
        order
      },

    });
    return list ? JSON.parse(JSON.stringify(list)) : false;

  } catch (error) {
    console.log('erro', error);
    return false
  }
};

exports.getListAssociateWithCount = async (model, model1, condition, condition1, attributes, attributes1, limit, offset, order) => {
  try {
    let list = await model.findAndCountAll({
      ...condition !== undefined && {
        where: condition
      },
      ...attributes !== undefined && {
        attributes
      },
      include: {
        model: model1,
        ...condition1 !== undefined && {
          where: condition1
        },
        ...attributes1 !== undefined && {
          attributes: attributes1
        },
        required: false // left join
      },
      ...limit !== undefined && {
        limit
      },
      ...offset !== undefined && {
        offset
      },
      ...order !== undefined && {
        order
      },
      // subQuery:false
    });
    return list ? JSON.parse(JSON.stringify(list)) : false;

  } catch (error) {
    console.log('erro', error);
    return false
  }
};

/**
 * Retrieves a list of records from a model having three associated models one inside another.
 * @param {Object} model - The main model to retrieve records from.
 * @param {Object} model1 - The first associated model.
 * @param {Object} model2 - The second associated model.
 * @param {Object} model3 - The third associated model.
 * @param {Object} condition - The condition to filter the records.
 * @param {Object} condition1 - The condition to filter the first associated model records.
 * @param {Object} condition2 - The condition to filter the second associated model records.
 * @param {Object} condition3 - The condition to filter the third associated model records.
 * @param {Array} attributes - The attributes to include in the result.
 * @param {Array} attributes1 - The attributes to include in the result of the first associated model.
 * @param {Array} attributes2 - The attributes to include in the result of the second associated model.
 * @param {Array} attributes3 - The attributes to include in the result of the third associated model.
 * @param {number} limit - The maximum number of records to retrieve.
 * @param {number} offset - The number of records to skip.
 * @param {Array} order - The order in which the records should be sorted.
 * @returns {Promise<Array|boolean>} - The list of records or false if an error occurs.
 */
exports.getListWithTripleAssociate = async (model, model1, model2, model3, condition, condition1, condition2, condition3, attributes, attributes1, attributes2, attributes3, limit, offset, order) => {
  try {
    let list = await model.findAndCountAll({
      ...condition !== undefined && {
        where: condition
      },
      ...attributes !== undefined && {
        attributes
      },
      include: [
        {
          model: model1,
          ...condition1 !== undefined && {
            where: condition1
          },
          ...attributes1 !== undefined && {
            attributes: attributes1
          },
          include: [
            {
              model: model2,
              ...condition2 !== undefined && {
                where: condition2
              },
              ...attributes2 !== undefined && {
                attributes: attributes2
              },
              include: [
                {
                  model: model3,
                  ...condition3 !== undefined && {
                    where: condition3
                  },
                  ...attributes3 !== undefined && {
                    attributes: attributes3
                  },
                }
              ]
            }
          ]
        }
      ],
      ...limit !== undefined && {
        limit
      },
      ...offset !== undefined && {
        offset
      },
      ...order !== undefined && {
        order
      },
      subQuery: false
    });
    return list ? JSON.parse(JSON.stringify(list)) : false;

  } catch (error) {
    console.log('erro', error);
    return false
  }
}


