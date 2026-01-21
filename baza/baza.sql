-- Tworzenie tabeli ról użytkowników
CREATE TABLE public.roles (
    idRole SERIAL PRIMARY KEY,
    role VARCHAR(50) NOT NULL
);

-- Tworzenie tabeli użytkowników
CREATE TABLE public.users (
    idUser SERIAL PRIMARY KEY,
    userName VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    telnumber VARCHAR(13) UNIQUE,
    isActive BOOLEAN DEFAULT TRUE NOT NULL,
    idRole INTEGER REFERENCES public.roles(idRole) ON DELETE SET NULL
);

-- Tworzenie tabeli ogłoszeń
CREATE TABLE public.offers (
    idOffer SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(500),
    isPrice BOOLEAN DEFAULT FALSE NOT NULL,
    price DECIMAL(10, 2),
    isActive BOOLEAN DEFAULT TRUE NOT NULL,
    addDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    imagePath VARCHAR(200),
    idUser INTEGER REFERENCES public.users(idUser) ON DELETE CASCADE
);

insert into public.roles(idrole, role) values(0,'user');
insert into public.roles(idrole, role) values(1,'admin');

insert into public.users(userName,email,password,idRole) 
values('user','user@user','$2b$10$a3s43zn.Gzolda2X0L9esuNdhXVlnTip1MShoK2xkYOx6YT5LALdi',0);
insert into public.users(userName,email,password,idRole) 
values('admin','admin@admin','$2b$10$OdmN/hcDoHFfWu0mM2fy9Oy4PCcoC6yNRAdwn5oejigAvLpn7xnJ6',1);