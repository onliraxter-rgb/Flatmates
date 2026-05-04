-- Fix flats table schema
ALTER TABLE flats ADD COLUMN status TEXT DEFAULT 'active';
ALTER TABLE flats ADD COLUMN plan TEXT DEFAULT 'free';
