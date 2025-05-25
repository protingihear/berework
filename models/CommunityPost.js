const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");
const Community = require("./Community");

const CommunityPost = sequelize.define("CommunityPost", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "id"
        }
    },
    communityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Community,
            key: "id"
        }
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    likedBy: {
        type: DataTypes.JSON, // Array of user IDs who liked the post
        allowNull: false,
        defaultValue: []
    }
}, {
    getterMethods: {
        likeCount() {
            return this.likedBy?.length || 0;
        }
    }
});

// Virtual method to set likedByMe for current user
CommunityPost.prototype.setLikedByMe = function(userId) {
    const liked = this.likedBy.includes(userId);
    this.setDataValue('likedByMe', liked ? 'yes' : 'no');
};

// Optional: to expose likedByMe in toJSON (e.g. for API response)
CommunityPost.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
    if (this.dataValues.likedByMe) {
        values.likedByMe = this.dataValues.likedByMe;
    }
    values.likeCount = this.likeCount;
    return values;
};

module.exports = CommunityPost;

