import { Schema, model } from 'mongoose';
const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

// username — необов’язкове поле. За замовчуванням воно дорівнює email користувача. У майбутньому користувач зможе змінити ім’я у профілі.
// Для цього ми використовуємо pre-hook Schema.pre("save"), який виконується перед збереженням користувача.
// Оскільки ми використовуємо this (посилання на поточний документ), функція не може бути стрілковою.
userSchema.pre('save', function () {
  if (!this.username) {
    this.username = this.email;
  }
});

// Перевизначаємо метод toJSON, для видалення паролю з відповіді
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = model('User', userSchema);
