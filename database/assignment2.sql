-- 1. Insert Tony Stark account info
INSERT INTO public.account 
(
    account_firstname,
    account_lastname,
    account_email,
    account_password
)
VALUES
(
    'Tony',
    'Stark',
    'tony@starkent.com',
    'Iam1ronM@n'
);

-- 2. Update Tony Stark's account type to admin
UPDATE public.account
    SET account_type = 'Admin'
    WHERE account_id = 1;

-- 3. Delete Tony Stark account from DB
DELETE FROM public.account
WHERE account_id = 1;

-- 4. Update GM Hummer description
UPDATE public.inventory 
	SET inv_description = REPLACE
    (
        inv_description,
        'the small interiors',
        'a huge interior'
    )
	WHERE inv_id = 10;

-- 5. Use an inner join
SELECT
    inv_make,
    inv_model
FROM
    public.inventory
INNER JOIN public.classification
    USING(classification_id)
	WHERE classification_name = 'Sport';

-- 6. Add /vehicles to file path for all records
UPDATE public.inventory 
	SET
	inv_image = REPLACE
    (
        inv_image,
        '/images/',
        '/images/vehicles/'
    ),
	inv_thumbnail = REPLACE
	(
		inv_thumbnail,
        '/images/',
        '/images/vehicles/'
	);
