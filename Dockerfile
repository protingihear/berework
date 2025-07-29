# Gunakan image node versi stabil
FROM node:18

# Set direktori kerja di container
WORKDIR /app

# Salin package dan install dependencies
COPY package*.json ./
RUN npm install

# Salin semua file ke dalam container
COPY . .

# Ekspose port sesuai aplikasi
EXPOSE 3000

# Jalankan aplikasi
CMD ["npm", "start"]
