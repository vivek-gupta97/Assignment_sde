module.exports = (sequelize, DataTypes) => {
    const Products = sequelize.define('Products', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        serial_no: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        request_id: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        product_name: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        input_image_urls: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        output_image_urls: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'products',
        timestamps: false,  // We already have a created_at field, so we don't need Sequelize to manage timestamps.
        paranoid: false     // No soft delete feature
    });

    // Define associations here
    Products.associate = function (models) {
        // Products.belongsTo(models.Requests, {
        //     foreignKey: 'request_id',
        //     targetKey: 'request_id',
        //     onDelete: 'CASCADE',
        //     constraints: false
        // });
    };

    return Products;
};
