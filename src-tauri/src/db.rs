use rusqlite::{Connection, Result, params};
use crate::get_db_path;
use crate::models::{Job, Person, Group};

pub struct Database;

impl Database {
    pub fn new() -> Self {
        Database
    }

    pub async fn fetch_all_jobs(&self) -> Result<Vec<Job>, String> {
        let conn = Connection::open(get_db_path()).map_err(|e| format!("Veritabanı açılamadı: {}", e))?;
        
        let mut stmt = conn.prepare(
            "SELECT id, title, description, start_date, end_date, group_id, person_id FROM jobs"
        ).map_err(|e| format!("Sorgu hazırlanamadı: {}", e))?;
    
        let jobs = stmt.query_map([], |row| {
            Ok(Job {
                id: Some(row.get(0)?),
                title: row.get(1)?,
                description: row.get(2)?,
                start_date: row.get(3)?,
                end_date: row.get(4)?,
                group_id: row.get(5)?,
                person_id: row.get(6)?
            })
        }).map_err(|e| format!("Veri okunamadı: {}", e))?;
    
        jobs.collect::<Result<Vec<_>, _>>().map_err(|e| format!("Veri dönüştürülemedi: {}", e))
    }
    
    pub async fn fetch_group_jobs(&self, group_id: i64) -> Result<Vec<Job>, String> {
        let conn = Connection::open(get_db_path()).map_err(|e| format!("Veritabanı açılamadı: {}", e))?;
        
        let mut stmt = conn.prepare(
            "SELECT id, title, description, start_date, end_date, group_id, person_id 
             FROM jobs WHERE group_id = ?"
        ).map_err(|e| format!("Sorgu hazırlanamadı: {}", e))?;
    
        let jobs = stmt.query_map([group_id], |row| {
            Ok(Job {
                id: Some(row.get(0)?),
                title: row.get(1)?,
                description: row.get(2)?,
                start_date: row.get(3)?,
                end_date: row.get(4)?,
                group_id: row.get(5)?,
                person_id: row.get(6)?
            })
        }).map_err(|e| format!("Veri okunamadı: {}", e))?;
    
        jobs.collect::<Result<Vec<_>, _>>().map_err(|e| format!("Veri dönüştürülemedi: {}", e))
    }
    
    pub async fn create_job(&self, job: Job) -> Result<(), String> {
        let conn = Connection::open(get_db_path()).map_err(|e| format!("Veritabanı açılamadı: {}", e))?;
        
        conn.execute(
            "INSERT INTO jobs (title, description, start_date, end_date, group_id, person_id) 
             VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
            params![
                job.title,
                job.description,
                job.start_date,
                job.end_date,
                job.group_id,
                job.person_id
            ],
        ).map_err(|e| format!("İş oluşturulamadı: {}", e))?;
    
        Ok(())
    }
    
    pub async fn update_job(&self, job_id: i64, job: Job) -> Result<(), String> {
        let conn = Connection::open(get_db_path()).map_err(|e| format!("Veritabanı açılamadı: {}", e))?;
        
        conn.execute(
            "UPDATE jobs 
             SET title = ?1, description = ?2, start_date = ?3, end_date = ?4, 
                 group_id = ?5, person_id = ?6
             WHERE id = ?7",
            params![
                job.title,
                job.description,
                job.start_date,
                job.end_date,
                job.group_id,
                job.person_id,
                job_id
            ],
        ).map_err(|e| format!("İş güncellenemedi: {}", e))?;
    
        Ok(())
    }
    
    pub async fn delete_job(&self, job_id: i64) -> Result<(), String> {
        let conn = Connection::open(get_db_path()).map_err(|e| format!("Veritabanı açılamadı: {}", e))?;
        
        conn.execute(
            "DELETE FROM jobs WHERE id = ?",
            params![job_id],
        ).map_err(|e| format!("İş silinemedi: {}", e))?;
    
        Ok(())
    }
    
    pub async fn fetch_all_persons(&self) -> Result<Vec<Person>, String> {
        let conn = Connection::open(get_db_path()).map_err(|e| format!("Veritabanı açılamadı: {}", e))?;
        
        let mut stmt = conn.prepare(
            "SELECT id, name, group_id FROM persons"
        ).map_err(|e| format!("Sorgu hazırlanamadı: {}", e))?;
    
        let persons = stmt.query_map([], |row| {
            Ok(Person {
                id: Some(row.get(0)?),
                name: row.get(1)?,
                group_id: row.get(2)?
            })
        }).map_err(|e| format!("Veri okunamadı: {}", e))?;
    
        persons.collect::<Result<Vec<_>, _>>().map_err(|e| format!("Veri dönüştürülemedi: {}", e))
    }
    
    pub async fn fetch_group_persons(&self, group_id: i64) -> Result<Vec<Person>, String> {
        let conn = Connection::open(get_db_path()).map_err(|e| format!("Veritabanı açılamadı: {}", e))?;
        
        let mut stmt = conn.prepare(
            "SELECT id, name, group_id FROM persons WHERE group_id = ?"
        ).map_err(|e| format!("Sorgu hazırlanamadı: {}", e))?;
    
        let persons = stmt.query_map([group_id], |row| {
            Ok(Person {
                id: Some(row.get(0)?),
                name: row.get(1)?,
                group_id: row.get(2)?
            })
        }).map_err(|e| format!("Veri okunamadı: {}", e))?;
    
        persons.collect::<Result<Vec<_>, _>>().map_err(|e| format!("Veri dönüştürülemedi: {}", e))
    }
    
    pub async fn create_person(&self, person: Person) -> Result<(), String> {
        let conn = Connection::open(get_db_path()).map_err(|e| format!("Veritabanı açılamadı: {}", e))?;
        
        conn.execute(
            "INSERT INTO persons (name, group_id) VALUES (?1, ?2)",
            params![
                person.name,
                person.group_id
            ],
        ).map_err(|e| format!("Personel oluşturulamadı: {}", e))?;
    
        Ok(())
    }
    
    pub async fn update_person(&self, person_id: i64, person: Person) -> Result<(), String> {
        let conn = Connection::open(get_db_path()).map_err(|e| format!("Veritabanı açılamadı: {}", e))?;
        
        conn.execute(
            "UPDATE persons SET name = ?1, group_id = ?2 WHERE id = ?3",
            params![
                person.name,
                person.group_id,
                person_id
            ],
        ).map_err(|e| format!("Personel güncellenemedi: {}", e))?;
    
        Ok(())
    }
    
    pub async fn delete_person(&self, person_id: i64) -> Result<(), String> {
        let conn = Connection::open(get_db_path()).map_err(|e| format!("Veritabanı açılamadı: {}", e))?;
        
        conn.execute(
            "DELETE FROM persons WHERE id = ?",
            params![person_id],
        ).map_err(|e| format!("Personel silinemedi: {}", e))?;
    
        Ok(())
    }
    
    pub async fn fetch_all_groups(&self) -> Result<Vec<Group>, String> {
        let conn = Connection::open(get_db_path()).map_err(|e| format!("Veritabanı açılamadı: {}", e))?;
        
        let mut stmt = conn.prepare(
            "SELECT g.id, g.name, g.description, 
             GROUP_CONCAT(p.id || ',' || p.name || ',' || p.group_id, ';') as persons
             FROM groups g
             LEFT JOIN persons p ON g.id = p.group_id
             GROUP BY g.id"
        ).map_err(|e| format!("Sorgu hazırlanamadı: {}", e))?;
    
        let groups = stmt.query_map([], |row| {
            let persons_str: Option<String> = row.get(3)?;
            let _persons = persons_str.map_or(Vec::new(), |s| {
                s.split(';')
                    .filter(|p| !p.is_empty())
                    .map(|p| {
                        let parts: Vec<&str> = p.split(',').collect();
                        Person {
                            id: Some(parts[0].parse().unwrap_or(0)),
                            name: parts[1].to_string(),
                            group_id: Some(parts[2].parse().unwrap_or(0))
                        }
                    })
                    .collect()
            });
    
            Ok(Group {
                id: Some(row.get(0)?),
                name: row.get(1)?,
                description: row.get(2)?
            })
        }).map_err(|e| format!("Veri okunamadı: {}", e))?;
    
        groups.collect::<Result<Vec<_>, _>>().map_err(|e| format!("Veri dönüştürülemedi: {}", e))
    }
    
    pub async fn create_group(&self, group: Group) -> Result<(), String> {
        let conn = Connection::open(get_db_path()).map_err(|e| format!("Veritabanı açılamadı: {}", e))?;
        
        conn.execute(
            "INSERT INTO groups (name, description) VALUES (?1, ?2)",
            params![
                group.name,
                group.description
            ],
        ).map_err(|e| format!("Grup oluşturulamadı: {}", e))?;
    
        Ok(())
    }
    
    pub async fn update_group(&self, group_id: i64, group: Group) -> Result<(), String> {
        let conn = Connection::open(get_db_path()).map_err(|e| format!("Veritabanı açılamadı: {}", e))?;
        
        conn.execute(
            "UPDATE groups SET name = ?1, description = ?2 WHERE id = ?3",
            params![
                group.name,
                group.description,
                group_id
            ],
        ).map_err(|e| format!("Grup güncellenemedi: {}", e))?;
    
        Ok(())
    }
    
    pub async fn delete_group(&self, group_id: i64) -> Result<(), String> {
        let conn = Connection::open(get_db_path()).map_err(|e| format!("Veritabanı açılamadı: {}", e))?;
        
        conn.execute(
            "DELETE FROM groups WHERE id = ?",
            params![group_id],
        ).map_err(|e| format!("Grup silinemedi: {}", e))?;
    
        Ok(())
    }
    
    pub async fn add_person_to_group(&self, group_id: i64, person_id: i64) -> Result<(), String> {
        let conn = Connection::open(get_db_path()).map_err(|e| format!("Veritabanı açılamadı: {}", e))?;
        
        conn.execute(
            "UPDATE persons SET group_id = ?1 WHERE id = ?2",
            params![group_id, person_id],
        ).map_err(|e| format!("Personel gruba eklenemedi: {}", e))?;
    
        Ok(())
    }
    
    pub async fn remove_person_from_group(&self, group_id: i64, person_id: i64) -> Result<(), String> {
        let conn = Connection::open(get_db_path()).map_err(|e| format!("Veritabanı açılamadı: {}", e))?;
        
        conn.execute(
            "UPDATE persons SET group_id = NULL WHERE id = ?1 AND group_id = ?2",
            params![person_id, group_id],
        ).map_err(|e| format!("Personel gruptan çıkarılamadı: {}", e))?;
    
        Ok(())
    }
    
    pub async fn fetch_person_jobs(&self, person_id: i64) -> Result<Vec<Job>, String> {
        let conn = Connection::open(crate::get_db_path())
            .map_err(|e| e.to_string())?;
        
        let mut stmt = conn.prepare(
            "SELECT j.* FROM jobs j 
             JOIN person_jobs pj ON j.id = pj.job_id 
             WHERE pj.person_id = ?"
        ).map_err(|e| e.to_string())?;
        
        let jobs = stmt.query_map([person_id], |row| {
            Ok(Job {
                id: Some(row.get(0)?),
                title: row.get(1)?,
                description: row.get(2)?,
                start_date: row.get(3)?,
                end_date: row.get(4)?,
                group_id: row.get(5)?,
                person_id: row.get(6)?
            })
        }).map_err(|e| e.to_string())?;

        jobs.collect::<Result<_, _>>()
            .map_err(|e| e.to_string())
    }

    pub async fn fetch_person_groups(&self, person_id: i64) -> Result<Vec<Group>, String> {
        let conn = Connection::open(crate::get_db_path())
            .map_err(|e| e.to_string())?;
        
        let mut stmt = conn.prepare(
            "SELECT g.* FROM groups g 
             JOIN person_groups pg ON g.id = pg.group_id 
             WHERE pg.person_id = ?"
        ).map_err(|e| e.to_string())?;
        
        let groups = stmt.query_map([person_id], |row| {
            Ok(Group {
                id: Some(row.get(0)?),
                name: row.get(1)?,
                description: row.get(2)?
            })
        }).map_err(|e| e.to_string())?;

        groups.collect::<Result<_, _>>()
            .map_err(|e| e.to_string())
    }

    pub async fn fetch_job_persons(&self, job_id: i64) -> Result<Vec<Person>, String> {
        let conn = Connection::open(crate::get_db_path())
            .map_err(|e| e.to_string())?;
        
        let mut stmt = conn.prepare(
            "SELECT p.* FROM persons p 
             JOIN person_jobs pj ON p.id = pj.person_id 
             WHERE pj.job_id = ?"
        ).map_err(|e| e.to_string())?;
        
        let persons = stmt.query_map([job_id], |row| {
            Ok(Person {
                id: Some(row.get(0)?),
                name: row.get(1)?,
                group_id: row.get(2)?
            })
        }).map_err(|e| e.to_string())?;

        persons.collect::<Result<_, _>>()
            .map_err(|e| e.to_string())
    }

    pub async fn fetch_job_groups(&self, job_id: i64) -> Result<Vec<Group>, String> {
        let conn = Connection::open(crate::get_db_path())
            .map_err(|e| e.to_string())?;
        
        let mut stmt = conn.prepare(
            "SELECT g.* FROM groups g 
             JOIN group_jobs gj ON g.id = gj.group_id 
             WHERE gj.job_id = ?"
        ).map_err(|e| e.to_string())?;
        
        let groups = stmt.query_map([job_id], |row| {
            Ok(Group {
                id: Some(row.get(0)?),
                name: row.get(1)?,
                description: row.get(2)?
            })
        }).map_err(|e| e.to_string())?;

        groups.collect::<Result<_, _>>()
            .map_err(|e| e.to_string())
    }
}
