# Richardson Maturity Model Evaluation
## Task Manager API Assessment

---

## 📊 Evaluation Table

| Level | Criterion | Does Your API Satisfy This? | Evidence |
|-------|-----------|------------------------------|----------|
| **Level 0** | Uses HTTP as transport mechanism | ✅ YES | API uses HTTP protocol for all communications |
| **Level 0** | Single endpoint, tunneling operations | ❌ NO | Multiple resource-based endpoints (good practice) |
| **Level 1** | Resources with URIs | ✅ YES | `/tasks` for collection, `/tasks/:id` for individual tasks |
| **Level 1** | Each resource has unique identifier | ✅ YES | Each task has unique `id` property (1, 2, 3...) |
| **Level 2** | Uses correct HTTP verbs | ✅ YES | GET (retrieve), POST (create), PUT (update), DELETE (delete) |
| **Level 2** | Uses HTTP status codes correctly | ✅ YES | 200 (OK), 201 (Created), 400 (Bad Request), 404 (Not Found), 500 (Server Error) |
| **Level 2** | Content negotiation (JSON) | ✅ YES | All responses are JSON format; Content-Type: application/json |
| **Level 2** | Proper error responses | ✅ YES | Errors return JSON with error messages and appropriate status codes |
| **Level 3** | HATEOAS (Hypermedia) | ❌ NO | Responses do not include `_links` with related URLs |
| **Level 3** | Self-describing links | ❌ NO | No navigation links included in response bodies |

---

## ✅ Current Maturity Level: **LEVEL 2**

Your API successfully implements **RESTful API Level 2** of the Richardson Maturity Model.

---

## 🔍 Endpoint Analysis

### **1. GET /tasks**
```
✅ Correct HTTP verb: GET
✅ Status code: 200 OK
✅ Returns collection of tasks
✅ No body required
Evidence: Line 34-36 in server.js
```

### **2. POST /tasks**
```
✅ Correct HTTP verb: POST
✅ Status code: 201 Created (for successful creation)
✅ Accepts JSON body with title, description
✅ Validates Content-Type header
✅ Returns created resource
Evidence: Lines 38-52 in server.js
```

### **3. PUT /tasks/:id**
```
✅ Correct HTTP verb: PUT
✅ Status code: 200 OK
✅ Uses resource identifier (:id)
✅ Validates task existence
✅ Partial updates supported
✅ Returns updated resource
Evidence: Lines 54-70 in server.js
```

### **4. DELETE /tasks/:id**
```
✅ Correct HTTP verb: DELETE
✅ Status code: 200 OK
✅ Uses resource identifier (:id)
✅ Validates task existence
✅ Returns confirmation message
Evidence: Lines 72-83 in server.js
```

### **5. Error Handling**
```
✅ 400 Bad Request: Invalid task ID, missing Content-Type, missing title
✅ 404 Not Found: Task not found scenarios
✅ 500 Internal Server Error: Catch-all error handler
✅ JSON error responses
Evidence: Lines 84-92 in server.js
```

---

## 🚀 Path to Level 3: HATEOAS Implementation

### **What is HATEOAS?**
**H**ypermedia **A**s **T**he **E**ngine **O**f **A**pplication **S**tate

It means responses include navigational links to related resources, making the API self-discoverable.

---

### **Example Level 3 Response for GET /tasks**

```json
{
  "data": [
    {
      "id": 1,
      "title": "Complete assignment",
      "description": "Finish Richardson Maturity Model evaluation",
      "completed": false,
      "_links": {
        "self": {
          "href": "/tasks/1",
          "method": "GET"
        },
        "update": {
          "href": "/tasks/1",
          "method": "PUT"
        },
        "delete": {
          "href": "/tasks/1",
          "method": "DELETE"
        }
      }
    }
  ],
  "_links": {
    "self": {
      "href": "/tasks",
      "method": "GET"
    },
    "create": {
      "href": "/tasks",
      "method": "POST"
    }
  }
}
```

---

### **Example Level 3 Response for GET /tasks/:id**

```json
{
  "id": 1,
  "title": "Complete assignment",
  "description": "Finish Richardson Maturity Model evaluation",
  "completed": false,
  "_links": {
    "self": {
      "href": "/tasks/1",
      "method": "GET"
    },
    "update": {
      "href": "/tasks/1",
      "method": "PUT"
    },
    "delete": {
      "href": "/tasks/1",
      "method": "DELETE"
    },
    "all_tasks": {
      "href": "/tasks",
      "method": "GET"
    }
  }
}
```

---

### **Example Level 3 Response for POST /tasks (Create)**

```json
{
  "id": 2,
  "title": "New task",
  "description": "Task description",
  "completed": false,
  "_links": {
    "self": {
      "href": "/tasks/2",
      "method": "GET"
    },
    "update": {
      "href": "/tasks/2",
      "method": "PUT"
    },
    "delete": {
      "href": "/tasks/2",
      "method": "DELETE"
    },
    "all_tasks": {
      "href": "/tasks",
      "method": "GET"
    }
  }
}
```

---

### **Two Key HATEOAS Links to Add (If Implementing Level 3):**

| Link Name | Purpose | HTTP Method | Example |
|-----------|---------|-------------|---------|
| **self** | Link to the resource itself | GET | `/tasks/123` |
| **delete** | Link to delete the resource | DELETE | `/tasks/123` |

These allow clients to:
- Discover available operations
- Construct URLs dynamically (not hardcoded)
- Navigate API without external documentation

---

## 📋 Summary

| Aspect | Status | Score |
|--------|--------|-------|
| HTTP Verbs Implementation | ✅ Complete | 25/25 |
| Status Codes Usage | ✅ Complete | 25/25 |
| Resource URIs | ✅ Complete | 25/25 |
| Error Handling | ✅ Complete | 15/15 |
| HATEOAS Links | ❌ Not Implemented | 0/10 |
| **Total Maturity Score** | **Level 2** | **90/100** |

---

## 🎯 Conclusion

Your Task Manager API is a **well-designed RESTful API at Level 2** with:
- ✅ Proper resource-based URL design
- ✅ Correct HTTP method usage
- ✅ Appropriate status codes
- ✅ Robust error handling
- ⏳ Ready for Level 3 enhancement with HATEOAS

To reach Level 3, add `_links` sections to response bodies as shown in the examples above.

---

**Generated:** 2026-08-02  
**Evaluated API:** Task Manager API v1.0.0  
**Evaluator:** Richardson Maturity Model Analysis
