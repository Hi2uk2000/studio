# AssetStream Backend Schema Requirements

This document outlines the database schema for the AssetStream application. The schema is designed for a NoSQL database like Google Cloud Firestore, organizing data into collections and documents.

## 1. `users`

Stores public-facing and private information about registered users. This collection's document ID should match the Firebase Auth UID.

-   **Collection:** `users`
-   **Document ID:** `{userId}` (Firebase Auth UID)

| Field               | Type                  | Description                                                                    | Example                                  |
| :------------------ | :-------------------- | :----------------------------------------------------------------------------- | :--------------------------------------- |
| `uid`               | `string`              | The user's unique Firebase Authentication ID.                                  | `aBCdEfgHiJkLmNoPqRsTuVwXyZ1`             |
| `email`             | `string`              | The user's email address.                                                      | `user@example.com`                       |
| `displayName`       | `string`              | The user's full name.                                                          | `Jane Doe`                               |
| `phoneNumber`       | `string`              | The user's primary contact phone number (optional).                            | `+447700900123`                          |
| `photoURL`          | `string`              | URL for the user's profile picture.                                            | `https://.../photo.jpg`                  |
| `address`           | `map`                 | The user's primary address (for non-property owners or mailing).               | (See `address` sub-fields)               |
| `role`              | `string`              | The user's primary role (`homeowner`, `landlord`, `tenant`, `propertyManager`).  | `homeowner`                              |
| `createdAt`         | `timestamp`           | The timestamp when the user account was created.                               | `2024-01-01T10:00:00Z`                   |
| `lastActive`        | `timestamp`           | The timestamp of the user's last activity.                                     | `2024-08-01T12:30:00Z`                   |
| `preferences`       | `map`                 | User-specific settings, like theme and notification choices.                   | (See `preferences` sub-fields)           |
| `emergencyContacts` | `array` (of `maps`) | A list of emergency contacts.                                                  | (See `emergencyContacts` sub-fields)     |

#### `address` (Map)

| Field        | Type     | Description                                | Example        |
| :----------- | :------- | :----------------------------------------- | :------------- |
| `line1`      | `string` | The first line of the street address.      | `123 Oak Avenue` |
| `line2`      | `string` | The second line of the address (optional).   | `Apt 2B`       |
| `city`       | `string` | The city or town.                          | `Manchester`   |
| `county`     | `string` | The county or region.                      | `Greater Manchester` |
| `postcode`   | `string` | The postal code.                           | `M1 2AB`       |
| `country`    | `string` | The country.                               | `United Kingdom` |

#### `preferences` (Map)

| Field                 | Type      | Description                                                    | Example     |
| :-------------------- | :-------- | :------------------------------------------------------------- | :---------- |
| `theme`               | `string`  | The user's preferred theme (`light`, `dark`, `system`).        | `dark`      |
| `defaultView`         | `string`  | The default page to load after login.                          | `dashboard` |
| `notifications`       | `map`     | Granular control over notification channels.                   | (See sub-fields) |

#### `preferences.notifications` (Map)

| Field          | Type      | Description                               | Example |
|:---------------|:----------|:------------------------------------------|:--------|
| `maintenance`  | `boolean` | Enable/disable maintenance alerts via email. | `true`    |
| `warranty`     | `boolean` | Enable/disable warranty expiry alerts via email. | `true`    |

#### `emergencyContacts` (Array of Maps)

| Field         | Type     | Description                             | Example              |
| :------------ | :------- | :-------------------------------------- | :------------------- |
| `name`        | `string` | The full name of the emergency contact. | `John Smith`         |
| `relationship`| `string` | The contact's relationship to the user. | `Neighbour`          |
| `phone`       | `string` | The contact's phone number.             | `+447700900456`      |

---

## 2. `properties`

Stores the core details for each property. A user can own or manage multiple properties.

-   **Collection:** `properties`
-   **Document ID:** `{propertyId}` (Auto-generated)

| Field             | Type                | Description                                                              | Example                              |
| :---------------- | :------------------ | :----------------------------------------------------------------------- | :----------------------------------- |
| `ownerIds`        | `array` (of `string`) | A list of UIDs for the users who own this property. (FK to `users`)      | [`aBC...`, `xYZ...`]                 |
| `propertyManagers`| `array` (of `string`) | A list of UIDs for users managing the property (optional). (FK to `users`) | [`lMn...`]                           |
| `address`         | `map`               | The normalized, full street address of the property.                     | (See `address` sub-fields above)     |
| `propertyType`    | `string`            | Type of property (e.g., `detached`, `flat`).                             | `detached`                           |
| `yearBuilt`       | `number`            | The year the property was constructed (optional).                        | `1985`                               |
| `lotSizeSqFt`     | `number`            | The total size of the land lot in square feet (optional).                | `5000`                               |
| `sizeSqFt`        | `number`            | The size of the property in square feet.                                 | `1200`                               |
| `bedrooms`        | `number`            | Number of bedrooms.                                                      | `3`                                  |
| `bathrooms`       | `number`            | Number of bathrooms.                                                     | `2`                                  |
| `purchasePrice`   | `number`            | The original purchase price of the property.                             | `350000`                             |
| `purchaseDate`    | `timestamp`         | The date the property was purchased.                                     | `2020-06-15T00:00:00Z`               |
| `epcRating`       | `string`            | The Energy Performance Certificate rating (optional).                    | `B`                                  |
| `councilTaxBand`  | `string`            | The council tax band (optional).                                         | `D`                                  |
| `images`          | `array` (of `maps`) | A list of images of the property.                                        | (See `images` sub-fields)            |
| `utilities`       | `map`               | Details about utility providers (optional).                              | (See `utilities` sub-fields)         |

#### `images` (Array of Maps)

| Field       | Type      | Description                         | Example                  |
|:------------|:----------|:------------------------------------|:-------------------------|
| `url`       | `string`  | The Cloud Storage URL of the image. | `https://.../photo.jpg`  |
| `caption`   | `string`  | A brief description of the image.   | `Front of house`         |
| `isPrimary` | `boolean` | Whether this is the primary image.  | `true`                   |

#### `utilities` (Map)

| Field         | Type     | Description                  | Example            |
|:--------------|:---------|:-----------------------------|:-------------------|
| `electricity` | `string` | The electricity provider.    | `Octopus Energy`   |
| `gas`         | `string` | The gas provider.            | `British Gas`      |
| `water`       | `string` | The water provider.          | `United Utilities` |

---

## 3. `assets`

A sub-collection of all tangible assets within a specific property.

-   **Collection Path:** `properties/{propertyId}/assets`
-   **Document ID:** `{assetId}` (Auto-generated)

| Field            | Type        | Description                                                                     | Example                          |
| :--------------- | :---------- | :------------------------------------------------------------------------------ | :------------------------------- |
| `name`           | `string`    | The name of the asset.                                                          | `Vaillant EcoTec Plus Boiler`      |
| `category`       | `string`    | The category of the asset (e.g., `Plumbing`, `Appliance`).                        | `Plumbing`                       |
| `location`       | `string`    | The room or area where the asset is located.                                    | `Utility Room`                   |
| `condition`      | `string`    | The current condition (`Excellent`, `Good`, `Fair`, `Poor`).                      | `Good`                           |
| `purchasePrice`  | `number`    | The original cost of the asset (optional).                                      | `1800.00`                        |
| `currentValue`   | `number`    | The estimated current or replacement value (optional).                          | `1200.00`                        |
| `lifespanYears`  | `number`    | The expected lifespan of the asset in years (optional).                         | `15`                             |
| `parentAssetId`  | `string`    | ID of a parent asset if this is a sub-component (optional). (FK to `assets`)      | `{systemId}`                     |
| `imageUrl`       | `string`    | URL to the primary photo of the asset.                                          | `https://.../boiler.jpg`         |
| `modelNumber`    | `string`    | The manufacturer's model number (optional).                                     | `ETEC-24`                        |
| `serialNumber`   | `string`    | The unique serial number (optional).                                            | `211020001018651`                |
| `purchaseDate`   | `timestamp` | The date the asset was purchased (optional).                                    | `2021-08-15T00:00:00Z`           |
| `warrantyExpiry` | `timestamp` | The date the manufacturer's warranty expires (optional).                        | `2026-08-14T00:00:00Z`           |

---

## 4. `maintenanceTasks`

A sub-collection of all scheduled and completed maintenance jobs for a property.

-   **Collection Path:** `properties/{propertyId}/maintenanceTasks`
-   **Document ID:** `{taskId}` (Auto-generated)

| Field              | Type                | Description                                                                                   | Example                  |
| :----------------- | :------------------ | :-------------------------------------------------------------------------------------------- | :----------------------- |
| `title`            | `string`            | A short description of the task.                                                              | `Annual Boiler Service`    |
| `assetId`          | `string`            | Foreign key to `assets` if the task is asset-specific (optional).                             | `{assetId}`              |
| `contractorId`     | `string`            | Foreign key to the `contractors` collection (optional).                                       | `{contractorId}`         |
| `status`           | `string`            | The workflow status (`Pending`, `Scheduled`, `In Progress`, `Awaiting Parts`, `Completed`, `Cancelled`). | `Scheduled`            |
| `priority`         | `string`            | The priority level (`High`, `Medium`, `Low`).                                                 | `High`                   |
| `frequency`        | `string`            | How often the task repeats (`One-off`, `Annually`, `Monthly`).                                | `Annually`               |
| `scheduledDate`    | `timestamp`         | The date the task is scheduled to be performed.                                               | `2024-11-15T00:00:00Z`   |
| `actualStartDate`  | `timestamp`         | The timestamp when work actually began (optional).                                            | `2024-11-15T09:00:00Z`   |
| `completionDate`   | `timestamp`         | The timestamp when the task was completed (optional).                                         | `2024-11-15T11:30:00Z`   |
| `estimatedCost`    | `number`            | The quoted or estimated cost (optional).                                                      | `100.00`                 |
| `actualCost`       | `number`            | The final cost of the task upon completion (optional).                                        | `95.00`                  |
| `partsAndMaterials`| `array` (of `maps`) | A list of parts or materials used for the job.                                                | (See `parts` sub-fields) |
| `beforeAfterImages`| `array` (of `string`) | A list of Cloud Storage URLs for before and after photos.                                   | [`https://.../before.jpg`] |
| `dependencyTaskId` | `string`            | The ID of a task that must be completed before this one can start (optional).                 | `{taskId}`               |

#### `partsAndMaterials` (Array of Maps)

| Field       | Type     | Description                     | Example         |
|:------------|:---------|:--------------------------------|:----------------|
| `name`      | `string` | The name of the part.           | `Ignition Lead` |
| `cost`      | `number` | The cost of the part.           | `15.50`         |
| `quantity`  | `number` | The quantity used.              | `1`             |

---

## 5. `documents`

A sub-collection for all files related to a property.

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

A sub-collection for all financial transactions for a property.

-   **Collection Path:** `properties/{propertyId}/expenses`
-   **Document ID:** `{expenseId}` (Auto-generated)

| Field          | Type        | Description                                                                                                    | Example                          |
| :------------- | :---------- | :------------------------------------------------------------------------------------------------------------- | :------------------------------- |
| `description`  | `string`    | A description of the transaction.                                                                              | `Council Tax`                    |
| `amount`       | `number`    | The monetary value of the expense.                                                                             | `180.00`                         |
| `category`     | `string`    | The expense category (`Mortgage`, `Utilities`, `Groceries`).                                                     | `Utilities`                      |
| `date`         | `timestamp` | The date of the transaction.                                                                                   | `2024-08-01T00:00:00Z`           |
| `paymentMethod`| `string`    | How the expense was paid (`Credit Card`, `Bank Transfer`, etc.).                                               | `Direct Debit`                   |
| `vendor`       | `string`    | The name of the vendor or recipient of the payment (optional).                                                 | `Manchester City Council`        |
| `taxDeductible`| `boolean`   | A flag to indicate if the expense may be tax deductible.                                                       | `true`                           |
| `receiptUrl`   | `string`    | A Cloud Storage URL for the scanned receipt or invoice (optional).                                             | `https://.../receipt.pdf`        |
| `isRecurring`  | `boolean`   | Flag to distinguish one-off expenses from recurring bills.                                                     | `true`                           |
| `recurringDetails` | `map`   | A map containing details for recurring bills. Only present if `isRecurring` is `true`.                         | (See sub-table below)            |

#### `recurringDetails` (Map)

| Field       | Type        | Description                                                  | Example                  |
| :---------- | :---------- | :----------------------------------------------------------- | :----------------------- |
| `frequency` | `string`    | How often the bill occurs (`monthly`, `yearly`).             | `monthly`                |
| `startDate` | `timestamp` | The date the recurring payment term begins.                  | `2024-04-01T00:00:00Z`   |

---

## 7. `contractors`

A top-level collection to manage all service providers and contractors.

-   **Collection:** `contractors`
-   **Document ID:** `{contractorId}` (Auto-generated)

| Field              | Type                  | Description                                                  | Example                          |
| :----------------- | :-------------------- | :----------------------------------------------------------- | :------------------------------- |
| `name`             | `string`              | The name of the contractor or company.                       | `ABC Gas Services`                 |
| `specialization`   | `string`              | The primary trade of the contractor (`Plumbing`, `Electrical`).| `Plumbing & Heating`             |
| `contactPerson`    | `string`              | The name of the primary contact person (optional).           | `Dave Smith`                     |
| `phone`            | `string`              | The main contact phone number.                               | `0161 123 4567`                  |
| `email`            | `string`              | The main contact email address.                              | `contact@abcgas.co.uk`           |
| `address`          | `map`                 | The contractor's business address (optional).                | (See `address` sub-fields)       |
| `averageRating`    | `number`              | An overall rating from 1 to 5, calculated from reviews.      | `4.8`                            |
| `notes`            | `string`              | Private notes about the contractor.                          | `Always reliable, good for emergency call-outs.` |
| `addedBy`          | `string`              | The UID of the user who first added this contractor.         | `aBCdEfgHiJkLmNoPqRsTuVwXyZ1`     