import mongoose from "mongoose"

const ProfileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name has not been supplied"],
      minlength: [
        2,
        "Name is too short and should be at least 2 characters in length",
      ],
      maxlength: [140, "Name is too long and should not exceed 140 characters"],
      validate: {
        validator: function (v: string): boolean {
          return /.+[^\s]/.test(v);
        },
        // message: (props: { value: any; }) => `${props.value} is not set`
      },
    },
    description: {
      type: String,
      required: false,
      maxlength: [
        400,
        "Description is too long and should not exceed 400 characters",
      ],
    },
    image: {
      type: String,
      required: true,
      validate: {
        validator: function (v: string): boolean {
          return /\.(jpg|jpeg|JPG|JPEG|png|PNG)$/.test(v);
        },
        message: (): string =>
          "Image does not have a valid extension. Please use: .jpg, .jpeg or .png",
      },
      minlength: [5, "Image name is to small, therefore not a valid name"], // eg z.png
    },
  },
  { timestamps: true }
);

// ProfileSchema.pre('save', function (next: Function) {
//   const self = this
//   mongoose.model('Profile', ProfileSchema).find({name: self.name}, function (err, docs) {
//     console.log('inside pre function')
//     console.log(docs)
//     if (docs) {
//       console.log('already exists')
//       const validationError = {
//         errors: {
//           profile: {
//             message: 'Profile already exists'
//           }
//         }
//       }
//       return next(new Error('profile'))
//     }
//     next()
//   })

export default mongoose.model("Profile", ProfileSchema);
