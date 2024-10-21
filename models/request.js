module.exports = (sequelize, DataTypes) => {
    const Requests = sequelize.define('Requests', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        request_id: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('PENDING', 'STARTED', 'IN_PROGRESS', 'COMPLETED', 'FAILED'),
            allowNull: false,
            defaultValue: 'PENDING'
        },
        webhook_url: {
            type: DataTypes.STRING,
            allowNull: true 
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'requests',
        timestamps: false,  // If you don't want Sequelize to manage updated_at field, set to false
        paranoid: false     // If you don't need soft delete feature
    });

    Requests.associate = function (models) {
        // Requests.hasMany(models.Products, { foreignKey: 'request_id', constraints: false });
    };

    return Requests;
};
