use crate::models::Person;
use crate::models::Group;
use crate::models::Job;
use crate::db::Database;
use tauri::State;

#[tauri::command]
pub async fn fetch_all_persons(db: State<'_, Database>) -> Result<Vec<Person>, String> {
    db.inner().fetch_all_persons()
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn create_person(person: Person, db: State<'_, Database>) -> Result<(), String> {
    db.inner().create_person(person)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn update_person(person_id: i64, person: Person, db: State<'_, Database>) -> Result<(), String> {
    db.inner().update_person(person_id, person)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_person(person_id: i64, db: State<'_, Database>) -> Result<(), String> {
    db.inner().delete_person(person_id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn fetch_all_groups(db: State<'_, Database>) -> Result<Vec<Group>, String> {
    db.inner().fetch_all_groups()
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn create_group(group: Group, db: State<'_, Database>) -> Result<(), String> {
    db.inner().create_group(group)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn update_group(group_id: i64, group: Group, db: State<'_, Database>) -> Result<(), String> {
    db.inner().update_group(group_id, group)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_group(group_id: i64, db: State<'_, Database>) -> Result<(), String> {
    db.inner().delete_group(group_id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn add_person_to_group(group_id: i64, person_id: i64, db: State<'_, Database>) -> Result<(), String> {
    db.inner().add_person_to_group(group_id, person_id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn remove_person_from_group(group_id: i64, person_id: i64, db: State<'_, Database>) -> Result<(), String> {
    db.inner().remove_person_from_group(group_id, person_id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn fetch_all_jobs(db: State<'_, Database>) -> Result<Vec<Job>, String> {
    db.inner().fetch_all_jobs()
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn create_job(job: Job, db: State<'_, Database>) -> Result<(), String> {
    db.inner().create_job(job)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn update_job(job_id: i64, job: Job, db: State<'_, Database>) -> Result<(), String> {
    db.inner().update_job(job_id, job)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_job(job_id: i64, db: State<'_, Database>) -> Result<(), String> {
    db.inner().delete_job(job_id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn fetch_group_jobs(group_id: i64, db: State<'_, Database>) -> Result<Vec<Job>, String> {
    db.inner().fetch_group_jobs(group_id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn fetch_group_persons(group_id: i64, db: State<'_, Database>) -> Result<Vec<Person>, String> {
    db.inner().fetch_group_persons(group_id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn fetch_person_jobs(person_id: i64, db: State<'_, Database>) -> Result<Vec<Job>, String> {
    db.inner().fetch_person_jobs(person_id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn fetch_person_groups(person_id: i64, db: State<'_, Database>) -> Result<Vec<Group>, String> {
    db.inner().fetch_person_groups(person_id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn fetch_job_persons(job_id: i64, db: State<'_, Database>) -> Result<Vec<Person>, String> {
    db.inner().fetch_job_persons(job_id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn fetch_job_groups(job_id: i64, db: State<'_, Database>) -> Result<Vec<Group>, String> {
    db.inner().fetch_job_groups(job_id)
        .await
        .map_err(|e| e.to_string())
}
