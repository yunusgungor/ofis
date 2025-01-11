// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod db;
mod models;
mod commands;
use commands::*;
use db::Database;

use std::path::PathBuf;

fn get_db_path() -> PathBuf {
    let app_data = std::env::var("APPDATA").unwrap();
    let path = PathBuf::from(app_data);
    if !path.exists() {
        std::fs::create_dir_all(&path).unwrap();
    }
    path.join("ofis.db")
}

fn main() {
    tauri::Builder::default()
        .manage(Database::new())
        .invoke_handler(tauri::generate_handler![
            fetch_all_persons,
            create_person,
            fetch_all_groups,
            create_group,
            update_group,
            delete_group,
            add_person_to_group,
            remove_person_from_group,
            fetch_all_jobs,
            create_job,
            update_job,
            delete_job,
            fetch_group_jobs,
            fetch_group_persons,
            fetch_person_jobs,
            fetch_person_groups,
            fetch_job_persons,
            fetch_job_groups,
            update_person,
            delete_person,
            fetch_table_data,
            update_table_data
        ])
        .run(tauri::generate_context!())
        .expect("Tauri uygulaması başlatılırken hata oluştu");
}
