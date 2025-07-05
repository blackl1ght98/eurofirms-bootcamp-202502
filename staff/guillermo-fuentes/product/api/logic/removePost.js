import { User, Post } from "../data/index.js";
import { validate, ValidationError, NotFoundError, CredentialsError, SystemError, AuthorshipError } from "com";
export const removePost = (userId, postId) => {
  validate.userId(userId);
  validate.postId(postId);

  return User.findById(userId)
    .catch((error) => {
      throw new SystemError("mongo error");
    })
    .then((user) => {
      if (!user) throw new NotFoundError("user not found");

      return Post.findById(postId)
        .catch((error) => {
          throw new SystemError("mongo error");
        })
        .then((post) => {
          if (!post) throw new NotFoundError("post not found");

          if (user.role !== "administrator" && post.author.toString() !== userId)
            throw new AuthorshipError("user not author of post");

          return Post.deleteOne({ _id: postId })
            .catch((error) => {
              throw new SystemError("mongo error");
            })
            .then(() => {});
        });
    });
};
