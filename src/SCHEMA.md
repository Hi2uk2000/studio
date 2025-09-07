# AssetStream Backend Schema Requirements

This document outlines the database schema for the AssetStream application. The schema is designed for a NoSQL database like Google Cloud Firestore, organizing data into collections and documents.

## 1. `users`

Stores public-facing information about registered users. This collection's document ID should match the Firebase Auth UID.

-   **Collection:** `users`
-   **Document ID:** `{userId}` (Firebase Auth UID)

| Field         | Type      | Description                                          | Example                       |
| :------------ | :-------- | :--------------------------------------------------- | :---------------------------- |
| `uid`         | `string`  | The user's unique Firebase Authentication ID.        | `aBCdEfgHiJkLmNoPqRsTuVwXyZ1` |
| `email`       | `string`  | The user's email address.                            | `user@example.com`            |
| `displayName` | `string`  | The user's full name.                                | `Jane Doe`                    |
| `photoURL`    | `string`  | URL for the user's profile picture.                  | `https://.../photo.jpg`       |
| `createdAt`   | `timestamp` | The timestamp when the user account was created.   | `2024-01-01T10:00:00Z`        |
| `role`        | `string`  | The user's role (`homeowner`, `landlord`, `tenant`). | `homeowner`                   |

---

## 2. `properties`

Stores the core details for each property a user manages. A user can have one or more properties.

-   **Collection:** `properties`
-   **Document ID:** `{propertyId}` (Auto-generated)

| Field               | Type        | Description                                                              | Example                               |
| :------------------ | :---------- | :----------------------------------------------------------------------- | :------------------------------------ |
| `ownerId`           | `string`    | The UID of the user who owns this property. (Foreign Key to `users`)     | `aBCdEfgHiJkLmNoPqRsTuVwXyZ1`          |
| `address`           | `string`    | The full street address of the property.                                 | `123 Oak Avenue, Manchester, M1 2AB`  |
| `propertyType`      | `string`    | Type of property (e.g., `detached`, `flat`).                             | `detached`                            |
| `bedrooms`          | `number`    | Number of bedrooms.                                                      | `3`                                   |
| `bathrooms`         | `number`    | Number of bathrooms.                                                     | `2`                                   |
| `sizeSqFt`          | `number`    | The size of the property in square feet.                                 | `1200`                                |
| `purchasePrice`     | `number`    | The original purchase price of the property.                             | `350000`                              |
| `purchaseDate`      | `timestamp` | The date the property was purchased.                                     | `2020-06-15T00:00:00Z`                |
| `epcRating`         | `string`    | The Energy Performance Certificate rating (optional).                    | `B`                                   |
| `councilTaxBand`    | `string`    | The council tax band (optional).                                         | `D`                                   |
| `mortgageDetails`   | `map`       | A map containing current mortgage information.                           | (See sub-table below)                 |
| `insurancePremiums` | `map`       | A map containing annual insurance costs.                                 | (See sub-table below)                 |

#### Sub-collection: `properties/{propertyId}/mortgageDetails` (Map)

| Field                 | Type        | Description                               | Example                  |
| :-------------------- | :---------- | :---------------------------------------- | :----------------------- |
| `initialMortgage`     | `number`    | The initial mortgage loan amount.         | `300000`                 |
| `currentBalance`      | `number`    | The outstanding mortgage balance.         | `270000`                 |
| `interestRate`        | `number`    | The current interest rate (%).            | `3.5`                    |
| `termYears`           | `number`    | The total length of the mortgage term.    | `25`                     |
| `renewalDate`         | `timestamp` | The date the current fixed term ends.     | `2025-06-01T00:00:00Z`   |
| `regularMonthlyPayment` | `number`  | The standard required monthly payment.    | `1340`                   |
| `paymentDayOfMonth`   | `number`    | The day of the month payment is made (1-31). | `1`                      |

#### Sub-collection: `properties/{propertyId}/insurancePremiums` (Map)

| Field       | Type     | Description                             | Example |
| :---------- | :------- | :-------------------------------------- | :------ |
| `buildings` | `number` | The annual premium for buildings insurance. | `300`     |
| `contents`  | `number` | The annual premium for contents insurance.  | `150`     |

---

## 3. `assets`

A collection of all tangible assets within a specific property.

-   **Collection Path:** `properties/{propertyId}/assets`
-   **Document ID:** `{assetId}` (Auto-generated)

| Field            | Type        | Description                                                                     | Example                          |
| :--------------- | :---------- | :------------------------------------------------------------------------------ | :------------------------------- |
| `name`           | `string`    | The name of the asset.                                                          | `Vaillant EcoTec Plus Boiler`      |
| `category`       | `string`    | The category of the asset (e.g., `Plumbing`, `Appliance`).                        | `Plumbing`                       |
| `location`       | `string`    | The room or area where the asset is located.                                    | `Utility Room`                   |
| `imageUrl`       | `string`    | URL to the primary photo of the asset.                                          | `https://.../boiler.jpg`         |
| `modelNumber`    | `string`    | The manufacturer's model number (optional).                                     | `ETEC-24`                        |
| `serialNumber`   | `string`    | The unique serial number (optional).                                            | `211020001018651`                |
| `purchaseDate`   | `timestamp` | The date the asset was purchased (optional).                                    | `2021-08-15T00:00:00Z`           |
| `warrantyExpiry` | `timestamp` | The date the manufacturer's warranty expires (optional).                        | `2026-08-14T00:00:00Z`           |

---

## 4. `maintenanceTasks`

A collection of all scheduled and completed maintenance jobs for a property.

-   **Collection Path:** `properties/{propertyId}/maintenanceTasks`
-   **Document ID:** `{taskId}` (Auto-generated)

| Field       | Type        | Description                                                                        | Example                |
| :---------- | :---------- | :--------------------------------------------------------------------------------- | :--------------------- |
| `assetId`   | `string`    | Foreign key to the `assets` collection if the task is for a specific asset.        | `{assetId}`            |
| `assetName` | `string`    | Denormalized name of the asset for easy display.                                   | `Vaillant EcoTec...`   |
| `title`     | `string`    | A short description of the task.                                                   | `Annual Boiler Service`  |
| `dueDate`   | `timestamp` | The date the task is scheduled to be completed.                                    | `2024-11-15T00:00:00Z` |
| `status`    | `string`    | The current status of the task (`Upcoming`, `Due Soon`, `Overdue`, `Completed`).   | `Upcoming`             |
| `priority`  | `string`    | The priority level (`High`, `Medium`, `Low`).                                      | `High`                 |
| `frequency` | `string`    | How often the task repeats (`One-off`, `Annually`, `Every 5 years`).               | `Annually`             |
| `cost`      | `number`    | The final cost of the task upon completion (optional).                             | `95.00`                |
| `contractor`| `string`    | The name of the service provider who performed the work (optional).                | `ABC Gas Services`     |

---

## 5. `documents`

A central repository for all files related to a property.

-   **Collection Path:** `properties/{propertyId}/documents`
-   **Document ID:** `{documentId}` (Auto-generated)

| Field           | Type        | Description                                                                  | Example                         |
| :-------------- | :---------- | :--------------------------------------------------------------------------- | :------------------------------ |
| `name`          | `string`    | The name of the file.                                                        | `Boiler-Manual.pdf`             |
| `storagePath`   | `string`    | The path to the file in Cloud Storage.                                       | `documents/{userId}/{docId}.pdf`  |
| `type`          | `string`    | The type or group for the document (`Manual`, `Warranty`, `Insurance`).        | `Manual`                        |
| `size`          | `number`    | The size of the file in bytes.                                               | `5800000`                       |
| `uploadedAt`    | `timestamp` | The timestamp when the document was uploaded.                                | `2024-02-20T00:00:00Z`          |
| `linkedAssetId` | `string`    | Foreign key to an asset if this document is directly related to it (optional). | `{assetId}`                     |
| `linkedTaskId`  | `string`    | Foreign key to a maintenance task (e.g., a quote or invoice) (optional).     | `{taskId}`                      |

---

## 6. `expenses`

A collection of all financial transactions (one-off and recurring) for a property.

-   **Collection Path:** `properties/{propertyId}/expenses`
-   **Document ID:** `{expenseId}` (Auto-generated)

| Field          | Type        | Description                                                                                                    | Example                          |
| :------------- | :---------- | :------------------------------------------------------------------------------------------------------------- | :------------------------------- |
| `isRecurring`  | `boolean`   | Flag to distinguish one-off expenses from recurring bills.                                                     | `true`                           |
| `description`  | `string`    | A description of the transaction.                                                                              | `Council Tax`                    |
| `amount`       | `number`    | The monetary value of the expense.                                                                             | `180.00`                         |
| `category`     | `string`    | The expense category (`Mortgage`, `Utilities`, `Groceries`).                                                     | `Utilities`                      |
| `date`         | `timestamp` | The date of the transaction (for one-off expenses).                                                              | `2024-08-01T00:00:00Z`           |
| `includeInSpend` | `boolean`   | Whether this expense should be counted in overall household spending totals.                                   | `true`                           |
| `recurringDetails` | `map`   | A map containing details for recurring bills. Only present if `isRecurring` is `true`.                         | (See sub-table below)            |

#### Sub-collection: `expenses/{expenseId}/recurringDetails` (Map)

| Field       | Type        | Description                                                  | Example                  |
| :---------- | :---------- | :----------------------------------------------------------- | :----------------------- |
| `frequency` | `string`    | How often the bill occurs (`monthly`, `yearly`).             | `monthly`                |
| `startDate` | `timestamp` | The date the recurring payment term begins.                  | `2024-04-01T00:00:00Z`   |
| `term`      | `number`    | The number of periods the payment lasts for (e.g., 10 or 1). | `10`                     |
| `termUnit`  | `string`    | The unit for the term (`months`, `years`).                   | `months`                 |
