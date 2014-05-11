CREATE TABLE User(
    id INTEGER PRIMARY KEY,
    username TEXT,
    password TEXT
);

CREATE TABLE Factory(
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    name TEXT,
    remark TEXT
);

CREATE TABLE Unit(
    id INTEGER PRIMARY KEY,
    factory_id INTEGER,
    name TEXT,
    num INTEGER,
    usage TEXT,
    remark TEXT
);

CREATE TABLE Part(
    id INTEGER PRIMARY KEY,
    factory_id INTEGER,
    name TEXT,
    remark TEXT
);

CREATE TABLE Craft(
    id INTEGER PRIMARY KEY,
    factory_id INTEGER,
    part_id INTEGER,
    route TEXT,
    carrying REAL,
    remark TEXT
);

INSERT INTO User(username, password) VALUES('admin', 'admin');

INSERT INTO Factory(name, remark) VALUES('工厂1', '测试工厂');

INSERT INTO Unit(factory_id, name, num, usage, remark) VALUES('1', '作业单位1', '1', '测试单位1', '测试');
INSERT INTO Unit(factory_id, name, num, usage, remark) VALUES('1', '作业单位2', '2', '测试单位2', '测试');
INSERT INTO Unit(factory_id, name, num, usage, remark) VALUES('1', '作业单位3', '3', '测试单位3', '测试');
INSERT INTO Unit(factory_id, name, num, usage, remark) VALUES('1', '作业单位4', '4', '测试单位4', '测试');

INSERT INTO Part(factory_id, name, remark) VALUES('1', '零件1', '测试零件');
INSERT INTO Part(factory_id, name, remark) VALUES('1', '零件2', '测试零件');
INSERT INTO Part(factory_id, name, remark) VALUES('1', '零件3', '测试零件');
INSERT INTO Part(factory_id, name, remark) VALUES('1', '零件4', '测试零件');

INSERT INTO Craft(factory_id, part_id, route, carrying, remark) VALUES('1', '1', '1,2,3,4', 10.5, '测试');
INSERT INTO Craft(factory_id, part_id, route, carrying, remark) VALUES('1', '2', '2,1,4', 20, '测试');
INSERT INTO Craft(factory_id, part_id, route, carrying, remark) VALUES('1', '3', '1,3,4', 41, '测试');
INSERT INTO Craft(factory_id, part_id, route, carrying, remark) VALUES('1', '4', '3,4', 3.3, '测试');



