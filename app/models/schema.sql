CREATE TABLE Factory(
    id INTEGER PRIMARY KEY,
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
    code TEXT,
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

INSERT INTO Factory(name, remark) VALUES('Hello', 'world');
INSERT INTO Factory(name, remark) VALUES('Oh', 'my god');

INSERT INTO Unit(factory_id, name, num, usage, remark) VALUES('1', 'what', '1', 'useeee', 'help me!');
INSERT INTO Unit(factory_id, name, num, usage, remark) VALUES('1', 'hahah', '2', 'fff', 'mabi');

INSERT INTO Unit(factory_id, name, num, usage, remark) VALUES('2', 'second', '1', 'xxx', 'vaaaaa');
INSERT INTO Unit(factory_id, name, num, usage, remark) VALUES('2', 'second', '2', 'yyy', 'buuuuu');

