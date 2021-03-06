-- 게시글
ALTER TABLE `COMMENT`
	DROP FOREIGN KEY `FK_BOARD_TO_COMMENT`; -- 게시판 -> 게시글

-- 이미지첨부파일
ALTER TABLE `ATTACHFILE`
	DROP FOREIGN KEY `FK_BOARD_TO_ATTACHFILE`; -- 게시판 -> 이미지첨부파일

-- 게시판
ALTER TABLE `BOARD`
	DROP PRIMARY KEY; -- 게시판 기본키

-- 게시글
ALTER TABLE `COMMENT`
	DROP PRIMARY KEY; -- 게시글 기본키

-- 이미지첨부파일
ALTER TABLE `ATTACHFILE`
	DROP PRIMARY KEY; -- 이미지첨부파일 기본키

-- 게시판
DROP TABLE IF EXISTS `BOARD` RESTRICT;

-- 게시글
DROP TABLE IF EXISTS `COMMENT` RESTRICT;

-- 이미지첨부파일
DROP TABLE IF EXISTS `ATTACHFILE` RESTRICT;

-- 게시판
CREATE TABLE `BOARD` (
	`B_NO`     INTEGER      NOT NULL COMMENT '게시글일련번호', -- 게시글일련번호
	`GRP`      INTEGER      NOT NULL COMMENT '같은그룹', -- 같은그룹
	`GRP_SEQ`  INTEGER      NOT NULL COMMENT '같은그룹내의 게시물 순서', -- 같은그룹내의 게시물 순서
	`DEPTH`    INTEGER      NOT NULL COMMENT '게시물 계층', -- 게시물 계층
	`TITLE`    VARCHAR(255) NOT NULL COMMENT '제목', -- 제목
	`WRITER`   VARCHAR(255) NOT NULL COMMENT '작성자', -- 작성자
	`PASSWORD` VARCHAR(255) NOT NULL COMMENT '암호', -- 암호
	`CONTENT`  TEXT         NOT NULL COMMENT '내용', -- 내용
	`REG_DATE` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '등록일' -- 등록일
)
COMMENT '게시판';

-- 게시판
ALTER TABLE `BOARD`
	ADD CONSTRAINT `PK_BOARD` -- 게시판 기본키
		PRIMARY KEY (
			`B_NO` -- 게시글일련번호
		);

ALTER TABLE `BOARD`
	MODIFY COLUMN `B_NO` INTEGER NOT NULL AUTO_INCREMENT COMMENT '게시글일련번호';

ALTER TABLE `BOARD`
	AUTO_INCREMENT = 1;

-- 게시글
CREATE TABLE `COMMENT` (
	`C_NO`     INTEGER      NOT NULL COMMENT '댓글일련번호', -- 댓글일련번호
	`B_NO`     INTEGER      NOT NULL COMMENT '게시글일련번호', -- 게시글일련번호
	`WRITER`   VARCHAR(255) NOT NULL COMMENT '작성자', -- 작성자
	`PASSWORD` VARCHAR(255) NOT NULL COMMENT '암호', -- 암호
	`CONTENT`  TEXT         NOT NULL COMMENT '내용', -- 내용
	`REG_DATE` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '등록일' -- 등록일
)
COMMENT '게시글';

-- 게시글
ALTER TABLE `COMMENT`
	ADD CONSTRAINT `PK_COMMENT` -- 게시글 기본키
		PRIMARY KEY (
			`C_NO` -- 댓글일련번호
		);

ALTER TABLE `COMMENT`
	MODIFY COLUMN `C_NO` INTEGER NOT NULL AUTO_INCREMENT COMMENT '댓글일련번호';

ALTER TABLE `COMMENT`
	AUTO_INCREMENT = 1;

-- 이미지첨부파일
CREATE TABLE `ATTACHFILE` (
	`F_NO`      INTEGER      NOT NULL COMMENT '첨부파일일련번호', -- 첨부파일일련번호
	`B_NO`      INTEGER      NOT NULL COMMENT '게시글일련번호', -- 게시글일련번호
	`ORI_NAME`  VARCHAR(255) NOT NULL COMMENT '원본파일이름', -- 원본파일이름
	`REAL_NAME` VARCHAR(255) NOT NULL COMMENT '저장된파일이름', -- 저장된파일이름
	`SAVED_DIR` VARCHAR(255) NOT NULL COMMENT '저장된파일경로' -- 저장된파일경로
)
COMMENT '이미지첨부파일';

-- 이미지첨부파일
ALTER TABLE `ATTACHFILE`
	ADD CONSTRAINT `PK_ATTACHFILE` -- 이미지첨부파일 기본키
		PRIMARY KEY (
			`F_NO` -- 첨부파일일련번호
		);

ALTER TABLE `ATTACHFILE`
	MODIFY COLUMN `F_NO` INTEGER NOT NULL AUTO_INCREMENT COMMENT '첨부파일일련번호';

-- 게시글
ALTER TABLE `COMMENT`
	ADD CONSTRAINT `FK_BOARD_TO_COMMENT` -- 게시판 -> 게시글
		FOREIGN KEY (
			`B_NO` -- 게시글일련번호
		)
		REFERENCES `BOARD` ( -- 게시판
			`B_NO` -- 게시글일련번호
		);

-- 이미지첨부파일
ALTER TABLE `ATTACHFILE`
	ADD CONSTRAINT `FK_BOARD_TO_ATTACHFILE` -- 게시판 -> 이미지첨부파일
		FOREIGN KEY (
			`B_NO` -- 게시글일련번호
		)
		REFERENCES `BOARD` ( -- 게시판
			`B_NO` -- 게시글일련번호
		);