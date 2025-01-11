use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Job {
    pub id: Option<i64>,
    pub title: String,
    pub description: String,
    pub start_date: String,
    pub end_date: String,
    pub group_id: Option<i64>,
    pub person_id: Option<i64>
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Person {
    pub id: Option<i64>,
    pub name: String,
    pub group_id: Option<i64>
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Group {
    pub id: Option<i64>,
    pub name: String,
    pub description: String
}