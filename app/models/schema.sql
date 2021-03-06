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

CREATE TABLE Nonlogistics(
    id INTEGER PRIMARY KEY,
    factory_id INTEGER,
    pair TEXT,
    level TEXT,
    reason INTEGER
);

CREATE TABLE NonlogisticsReason(
    id INTEGER PRIMARY KEY,
    factory_id INTEGER,
    num INTEGER,
    reason TEXT
);

CREATE TABLE Result(
    id INTEGER PRIMARY KEY,
    factory_id INTEGER,
    position TEXT,
    remark TEXT
);

INSERT INTO User(username, password) VALUES('admin', 'admin');

INSERT INTO Factory(user_id, name, remark) VALUES('1', '变速箱厂', '生产变速箱');

INSERT INTO Unit(factory_id, name, num, usage, remark) VALUES('1', '原材料库', '1', '存储钢材', '露天');
INSERT INTO Unit(factory_id, name, num, usage, remark) VALUES('1', '铸造车间', '2', '铸造', '');
INSERT INTO Unit(factory_id, name, num, usage, remark) VALUES('1', '热处理车间', '3', '热处理', '');
INSERT INTO Unit(factory_id, name, num, usage, remark) VALUES('1', '机加工车间', '4', '车、铣、钻', '');
INSERT INTO Unit(factory_id, name, num, usage, remark) VALUES('1', '精密车间', '5', '精镗、磨销', '');
INSERT INTO Unit(factory_id, name, num, usage, remark) VALUES('1', '标准件、半成品库', '6', '储存外购半成品', '');

INSERT INTO Part(factory_id, name, remark) VALUES('1', '机盖', '');
INSERT INTO Part(factory_id, name, remark) VALUES('1', '机座', '');
INSERT INTO Part(factory_id, name, remark) VALUES('1', '大齿轮', '');
INSERT INTO Part(factory_id, name, remark) VALUES('1', '轴', '');
INSERT INTO Part(factory_id, name, remark) VALUES('1', '齿轮轴', '');
INSERT INTO Part(factory_id, name, remark) VALUES('1', '端盖', '');

INSERT INTO Craft(factory_id, part_id, route, carrying, remark) VALUES('1', '1', '1,2,4,5,6', 2500, '');
INSERT INTO Craft(factory_id, part_id, route, carrying, remark) VALUES('1', '2', '1,2,4,5,6', 3000, '');
INSERT INTO Craft(factory_id, part_id, route, carrying, remark) VALUES('1', '3', '1,2,4,3,4,6', 1000, '');
INSERT INTO Craft(factory_id, part_id, route, carrying, remark) VALUES('1', '4', '1,4,5,3,4,6', 800, '');
INSERT INTO Craft(factory_id, part_id, route, carrying, remark) VALUES('1', '5', '1,4,5,3,4,6', 1400, '');
INSERT INTO Craft(factory_id, part_id, route, carrying, remark) VALUES('1', '6', '1,2,4', 50, '');

INSERT INTO Nonlogistics(factory_id, pair, level, reason) VALUES('1', '1-2', 'A', 1);
INSERT INTO Nonlogistics(factory_id, pair, level, reason) VALUES('1', '1-3', 'I', 1);
INSERT INTO Nonlogistics(factory_id, pair, level, reason) VALUES('1', '1-4', 'E', 2);
INSERT INTO Nonlogistics(factory_id, pair, level, reason) VALUES('1', '1-5', 'U', 3);
INSERT INTO Nonlogistics(factory_id, pair, level, reason) VALUES('1', '1-6', 'U', 3);
INSERT INTO Nonlogistics(factory_id, pair, level, reason) VALUES('1', '2-3', 'U', 4);
INSERT INTO Nonlogistics(factory_id, pair, level, reason) VALUES('1', '2-4', 'E', 4);
INSERT INTO Nonlogistics(factory_id, pair, level, reason) VALUES('1', '2-5', 'U', 2);
INSERT INTO Nonlogistics(factory_id, pair, level, reason) VALUES('1', '2-6', 'U', 1);
INSERT INTO Nonlogistics(factory_id, pair, level, reason) VALUES('1', '3-4', 'I', 4);
INSERT INTO Nonlogistics(factory_id, pair, level, reason) VALUES('1', '3-5', 'U', 3);
INSERT INTO Nonlogistics(factory_id, pair, level, reason) VALUES('1', '3-6', 'U', 3);
INSERT INTO Nonlogistics(factory_id, pair, level, reason) VALUES('1', '4-5', 'E', 4);
INSERT INTO Nonlogistics(factory_id, pair, level, reason) VALUES('1', '4-6', 'E', 5);
INSERT INTO Nonlogistics(factory_id, pair, level, reason) VALUES('1', '5-6', 'I', 1);

INSERT INTO NonlogisticsReason(factory_id, num, reason) VALUES('1', 1, '物料搬运');
INSERT INTO NonlogisticsReason(factory_id, num, reason) VALUES('1', 2, '管理方便');
INSERT INTO NonlogisticsReason(factory_id, num, reason) VALUES('1', 3, '振动、噪声、烟尘');
INSERT INTO NonlogisticsReason(factory_id, num, reason) VALUES('1', 4, '工作流程的连续性');
INSERT INTO NonlogisticsReason(factory_id, num, reason) VALUES('1', 5, '安全及污染');

