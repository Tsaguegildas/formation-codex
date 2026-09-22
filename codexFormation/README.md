# Formation Codex

Ceci est une formation de Codex.

## Backend

Le dossier `backend` contient une API Spring Boot pour une application de vente de telephones.

Endpoints principaux :

- `GET /api/phones` : lister les telephones
- `GET /api/phones/{id}` : afficher un telephone
- `POST /api/phones` : creer un telephone
- `PUT /api/phones/{id}` : modifier un telephone
- `DELETE /api/phones/{id}` : supprimer un telephone

Pour lancer le backend :

```bash
cd backend
mvn spring-boot:run
```

La console H2 est disponible sur `http://localhost:8080/h2-console`.

## Frontend

Le dossier `frontend` contient une application React pour gerer le catalogue de telephones.

Fonctionnalites :

- lister les telephones
- rechercher dans le catalogue
- ajouter un telephone
- modifier un telephone
- supprimer un telephone

Pour lancer le frontend :

```bash
cd frontend
npm install
npm run dev
```

Le frontend sera disponible sur `http://localhost:5173`.
