-- 清空所有表数据（TRUNCATE比DELETE更高效，因为它不记录日志）
TRUNCATE TABLE file_metadata CASCADE;
TRUNCATE TABLE user CASCADE;
TRUNCATE TABLE search_history CASCADE;
TRUNCATE TABLE directory CASCADE;

-- 插入测试用户数据
INSERT INTO user (id, username, email, password, role, enabled, created_at, updated_at)
VALUES (1, 'user1', 'user1@example.com', '$2a$10$Nn19YvYHd1M8rH0v4gNQ.eJqH1yYp4Bnq2Yl7pWzXJQd4q8WpX2S', 'USER', true, NOW(), NOW()),
       (2, 'admin', 'admin@example.com', '$2a$10$Nn19YvYHd1M8rH0v4gNQ.eJqH1yYp4Bnq2Yl7pWzXJQd4q8WpX2S', 'ADMIN', true, NOW(), NOW());

-- 插入测试目录结构
INSERT INTO directory (id, name, path, parent_id, created_at, updated_at)
VALUES (1, 'root', '/', NULL, NOW(), NOW()),
       (2, 'documents', '/documents/', 1, NOW(), NOW()),
       (3, 'images', '/images/', 1, NOW(), NOW()),
       (4, 'reports', '/documents/reports/', 2, NOW(), NOW());

-- 插入测试文件元数据
INSERT INTO file_metadata (id, file_name, file_path, file_size, last_modified, file_type, indexed, content, directory_id, created_at, updated_at)
VALUES (1, 'document1.pdf', '/documents/', 1234567, '2023-05-15 10:30:00', 'PDF', true, 'This is a sample PDF document with searchable content about programming and software development.', 2, NOW(), NOW()),
       (2, 'spreadsheet.xlsx', '/documents/', 2345678, '2023-05-14 15:45:00', 'XLSX', true, 'Financial data spreadsheet for the first quarter of 2023 including revenue and expenses.', 2, NOW(), NOW()),
       (3, 'presentation.pptx', '/presentations/', 3456789, '2023-05-13 09:15:00', 'PPTX', true, 'Technical presentation about the new features in our application released in May 2023.', NULL, NOW(), NOW()),
       (4, 'image.jpg', '/images/', 4567890, '2023-05-12 16:20:00', 'JPG', true, 'Product image for marketing materials', 3, NOW(), NOW()),
       (5, 'document2.pdf', '/documents/reports/', 5678901, '2023-05-11 11:05:00', 'PDF', true, 'Annual report for the year 2022 showing company performance and future projections.', 4, NOW(), NOW());

-- 插入测试搜索历史数据
INSERT INTO search_history (id, search_query, search_time, user_id, result_count, created_at)
VALUES (1, 'programming', '2023-05-15 14:20:00', 1, 5, NOW()),
       (2, 'financial', '2023-05-15 14:25:00', 1, 3, NOW()),
       (3, 'application features', '2023-05-15 14:30:00', 2, 2, NOW()),
       (4, 'marketing', '2023-05-15 14:35:00', 1, 1, NOW()),
       (5, 'annual report', '2023-05-15 14:40:00', 2, 1, NOW());    