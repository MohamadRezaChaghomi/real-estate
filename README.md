# خانه ی پدری - سامانه مدیریت املاک 🏠

**[English Version](#english-version-real-estate-management-system)**

---

## 📍 نسخه فارسی

### درباره پروژه
**خانه ی پدری** یک سامانه جامع و حرفه‌ای برای مدیریت و معاملات املاک است که با فناوری‌های روز دنیا طراحی و توسعه یافته است.

### ویژگی‌های اصلی

#### 🏘️ **مدیریت ملک‌ها**
- ثبت و ویرایش اطلاعات ملک (نوع، متراژ، طبقه، تعداد اتاق‌ها)
- مدیریت تصاویر ملک
- مشخصات جزئی (آسانسور، پارکینگ، انبار، سال ساخت)
- سیستم فیلتر و جستجوی پیشرفته
- نمایش روی نقشه با Leaflet

#### 👥 **مدیریت خریداران**
- ثبت اطلاعات خریداران با شماره خریدار منحصر
- مشخص کردن ترجیحات (نوع ملک، بودجه، متراژ مورد نظر)
- سیستم فیلتر و جستجو برای خریداران

#### 📋 **مدیریت معاملات**
- ثبت معاملات خرید/فروش/اجاره
- پیگیری وضعیت معاملات
- محاسبه تومان‌های رهن و اجاره
- گزارشات تفصیلی

#### 📅 **تقویم و قرارملاقات‌ها**
- مدیریت قرارملاقات‌های ملاقات
- تقویم تفاعلی برای مشاهده معاملات

#### 📊 **گزارشات و آمار**
- آمار فروش و معاملات
- نمودارهای تجزیه و تحلیل
- صادرات اطلاعات به Excel
  
	- برای صادرات داده‌ها: در صفحات "املاک" و "خریداران" دکمه "خروجی اکسل" وجود دارد که با کلیک، فایل Excel شامل تمامی فیلدهای ثبت‌شده دانلود می‌شود. همچنین APIهای زیر برای استخراج فایل‌ها در دسترس هستند:
		- `GET /api/properties/export` → خروجی کامل املاک (properties.xlsx)
		- `GET /api/customers/export` → خروجی کامل خریداران (customers.xlsx)

#### 🌙 **تم تاریک و روشن**
- پشتیبانی کامل از Dark Mode
- رابط کاربری زیبا و مینیمالیستی

#### 🔐 **سیستم لاگ حفاظتی**
- ثبت تمام تغییرات (Audit Log)
- مشاهده تاریخچه عملیات

---

## 🛠️ فناوری‌های استفاده شده

| فناوری | نسخه | توصیف |
|--------|------|--------|
| **Next.js** | 16.1.6 | فریم‌ورک React برای تولید وب |
| **React** | 19.0.0 | کتابخانه UI |
| **MongoDB** | 6.13.0 | پایگاه داده NoSQL |
| **Mongoose** | 8.9.5 | ODM برای MongoDB |
| **Tailwind CSS** | 3.4.1 | فریم‌ورک CSS |
| **Leaflet** | 1.9.4 | کتابخانه نقشه |
| **Lucide React** | 0.474.0 | آیکون‌های SVG |
| **Next Themes** | 0.4.4 | مدیریت تم‌ها |
| **ExcelJS** | 4.4.0 | صادرات اطلاعات |

---

## 📦 نصب و راه‌اندازی

### پیش‌نیازها
- Node.js (v18 یا بالاتر)
- npm یا yarn
- MongoDB (محلی یا ابری)

### مراحل نصب

#### 1️⃣ کلون کردن مخزن
```bash
git clone https://github.com/MohamadRezaChaghomi/real-estate.git
cd real-estate
```

#### 2️⃣ نصب وابستگی‌ها
```bash
npm install
```

#### 3️⃣ تنظیم متغیرهای محیطی
فایل `.env.local` را در ریشه پروژه ایجاد کنید:

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/real-estate
NEXT_PUBLIC_API_URL=http://localhost:3000
```

#### 4️⃣ اجرای سرور توسعه
```bash
npm run dev
```

سرور در آدرس `http://localhost:3000` اجرا می‌شود.

---

## 🚀 فرمان‌های مفید

```bash
npm run dev      # اجرای سرور توسعه
npm run build    # ساخت برای تولید
npm start        # اجرای سرور تولید
npm run lint     # بررسی کد
```

---

## 📁 ساختار پروژه

```
real-estate/
├── app/                   # صفحات Next.js
│   ├── api/              # API Routes
│   ├── customers/        # صفحات خریداران
│   ├── properties/       # صفحات ملک‌ها
│   ├── transactions/     # صفحات معاملات
│   └── calendar/         # صفحه تقویم
├── components/           # کامپوننت‌های React
├── controllers/          # منطق کسب‌وکار
├── models/               # مدل‌های MongoDB
├── styles/               # فایل‌های CSS ماژولی
└── public/               # فایل‌های استاتیک
```

---

## 📞 تماس و پشتیبانی

**شماره تماس:** `01907492202`

**Repository:** https://github.com/MohamadRezaChaghomi/real-estate.git

---

---

# English Version: Real Estate Management System 🏠

### About the Project
**Khaneh Pedari (خانه ی پدری)** is a comprehensive and professional real estate management and transaction system designed with modern technologies.

### Key Features

#### 🏘️ **Property Management**
- Register and edit property information (type, area, floor, rooms)
- Property image management
- Detailed specifications (elevator, parking, storage, year built)
- Advanced filtering and search
- Map display with Leaflet

#### 👥 **Customer Management**
- Register customer information with unique IDs
- Set preferences (property type, budget, desired area)
- Filter and search customers

#### 📋 **Transaction Management**
- Register buy/sell/rent transactions
- Track transaction status
- Detailed reports

#### 📅 **Calendar & Appointments**
- Manage meeting appointments
- Interactive calendar view

#### 📊 **Reports & Analytics**
- Sales and transaction statistics
- Analysis graphs
- Excel export

#### 🌙 **Dark and Light Themes**
- Full Dark Mode support
- Beautiful UI

#### 🔐 **Audit Log System**
- Record all changes
- View operation history

---

## 🛠️ Technologies Used

| Technology | Version | Description |
|--------|------|--------|
| **Next.js** | 16.1.6 | React framework |
| **React** | 19.0.0 | UI library |
| **MongoDB** | 6.13.0 | NoSQL database |
| **Mongoose** | 8.9.5 | MongoDB ODM |
| **Tailwind CSS** | 3.4.1 | CSS framework |
| **Leaflet** | 1.9.4 | Mapping library |
| **Lucide React** | 0.474.0 | SVG icons |
| **Next Themes** | 0.4.4 | Theme management |

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB

### Installation Steps

#### 1️⃣ Clone Repository
```bash
git clone https://github.com/MohamadRezaChaghomi/real-estate.git
cd real-estate
```

#### 2️⃣ Install Dependencies
```bash
npm install
```

#### 3️⃣ Set Environment Variables
Create `.env.local`:

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/real-estate
NEXT_PUBLIC_API_URL=http://localhost:3000
```

#### 4️⃣ Run Development Server
```bash
npm run dev
```

The server will run at `http://localhost:3000`.

---

## 🚀 Useful Commands

```bash
npm run dev      # Run development server
npm run build    # Build for production
npm start        # Run production server
npm run lint     # Check code
```

---

## 📁 Project Structure

```
real-estate/
├── app/                   # Next.js pages
│   ├── api/              # API Routes
│   ├── customers/        # Customer pages
│   ├── properties/       # Property pages
│   ├── transactions/     # Transaction pages
│   └── calendar/         # Calendar page
├── components/           # React components
├── controllers/          # Business logic
├── models/               # MongoDB models
├── styles/               # CSS module files
└── public/               # Static files
```

---

## 📞 Contact & Support

**Phone:** `01907492202`

**Repository:** https://github.com/MohamadRezaChaghomi/real-estate.git

---

## 📄 License

This project is released under the MIT License.
