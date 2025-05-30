PGDMP  *    9                }            project    17.4    17.4 !    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            �           1262    24754    project    DATABASE     {   CREATE DATABASE project WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Russian_Russia.1251';
    DROP DATABASE project;
                     postgres    false                        2615    2200    public    SCHEMA        CREATE SCHEMA public;
    DROP SCHEMA public;
                     pg_database_owner    false            �           0    0    SCHEMA public    COMMENT     6   COMMENT ON SCHEMA public IS 'standard public schema';
                        pg_database_owner    false    4            �            1259    24773    status    TABLE     �   CREATE TABLE public.status (
    id integer NOT NULL,
    name text NOT NULL,
    color text DEFAULT 'bg-blue-600'::text NOT NULL,
    visible boolean DEFAULT false NOT NULL
);
    DROP TABLE public.status;
       public         heap r       postgres    false    4            �            1259    24772    status_id_seq    SEQUENCE     �   CREATE SEQUENCE public.status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.status_id_seq;
       public               postgres    false    4    221            �           0    0    status_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.status_id_seq OWNED BY public.status.id;
          public               postgres    false    220            �            1259    24781    tickets    TABLE     C  CREATE TABLE public.tickets (
    uuid uuid NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    topic_id integer NOT NULL,
    author_uuid uuid NOT NULL,
    status_id integer DEFAULT 1 NOT NULL,
    author text NOT NULL,
    author_email text NOT NULL,
    create_at timestamp with time zone NOT NULL
);
    DROP TABLE public.tickets;
       public         heap r       postgres    false    4            �            1259    24756    topic    TABLE     O   CREATE TABLE public.topic (
    id integer NOT NULL,
    name text NOT NULL
);
    DROP TABLE public.topic;
       public         heap r       postgres    false    4            �            1259    24755    topic_id_seq    SEQUENCE     �   CREATE SEQUENCE public.topic_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.topic_id_seq;
       public               postgres    false    4    218            �           0    0    topic_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.topic_id_seq OWNED BY public.topic.id;
          public               postgres    false    217            �            1259    24764    users    TABLE     �   CREATE TABLE public.users (
    uuid uuid NOT NULL,
    username text NOT NULL,
    email text,
    password text NOT NULL,
    role text DEFAULT 'user'::text NOT NULL,
    responsibility integer
);
    DROP TABLE public.users;
       public         heap r       postgres    false    4            �            1259    32995    users_responsibility_seq    SEQUENCE     �   CREATE SEQUENCE public.users_responsibility_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.users_responsibility_seq;
       public               postgres    false    219    4            �           0    0    users_responsibility_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.users_responsibility_seq OWNED BY public.users.responsibility;
          public               postgres    false    223            1           2604    24776 	   status id    DEFAULT     f   ALTER TABLE ONLY public.status ALTER COLUMN id SET DEFAULT nextval('public.status_id_seq'::regclass);
 8   ALTER TABLE public.status ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    221    220    221            /           2604    24759    topic id    DEFAULT     d   ALTER TABLE ONLY public.topic ALTER COLUMN id SET DEFAULT nextval('public.topic_id_seq'::regclass);
 7   ALTER TABLE public.topic ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    218    217    218            �          0    24773    status 
   TABLE DATA           :   COPY public.status (id, name, color, visible) FROM stdin;
    public               postgres    false    221   $       �          0    24781    tickets 
   TABLE DATA           ~   COPY public.tickets (uuid, title, description, topic_id, author_uuid, status_id, author, author_email, create_at) FROM stdin;
    public               postgres    false    222   �$       �          0    24756    topic 
   TABLE DATA           )   COPY public.topic (id, name) FROM stdin;
    public               postgres    false    218   �'       �          0    24764    users 
   TABLE DATA           V   COPY public.users (uuid, username, email, password, role, responsibility) FROM stdin;
    public               postgres    false    219   m(       �           0    0    status_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.status_id_seq', 3, true);
          public               postgres    false    220            �           0    0    topic_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.topic_id_seq', 5, true);
          public               postgres    false    217            �           0    0    users_responsibility_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.users_responsibility_seq', 1, true);
          public               postgres    false    223            :           2606    24780    status status_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.status
    ADD CONSTRAINT status_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.status DROP CONSTRAINT status_pkey;
       public                 postgres    false    221            <           2606    24787    tickets tickets_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_pkey PRIMARY KEY (uuid);
 >   ALTER TABLE ONLY public.tickets DROP CONSTRAINT tickets_pkey;
       public                 postgres    false    222            6           2606    24763    topic topic_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.topic
    ADD CONSTRAINT topic_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.topic DROP CONSTRAINT topic_pkey;
       public                 postgres    false    218            8           2606    24771    users users_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (uuid);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public                 postgres    false    219            >           2606    24793    tickets author_uuid    FK CONSTRAINT     �   ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT author_uuid FOREIGN KEY (author_uuid) REFERENCES public.users(uuid) ON UPDATE CASCADE ON DELETE CASCADE;
 =   ALTER TABLE ONLY public.tickets DROP CONSTRAINT author_uuid;
       public               postgres    false    222    219    4664            =           2606    33003    users responsibility    FK CONSTRAINT     �   ALTER TABLE ONLY public.users
    ADD CONSTRAINT responsibility FOREIGN KEY (responsibility) REFERENCES public.topic(id) NOT VALID;
 >   ALTER TABLE ONLY public.users DROP CONSTRAINT responsibility;
       public               postgres    false    219    218    4662            ?           2606    24798    tickets status_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT status_id FOREIGN KEY (status_id) REFERENCES public.status(id) ON UPDATE CASCADE ON DELETE CASCADE;
 ;   ALTER TABLE ONLY public.tickets DROP CONSTRAINT status_id;
       public               postgres    false    221    222    4666            @           2606    24788    tickets topic_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT topic_id FOREIGN KEY (topic_id) REFERENCES public.topic(id) ON UPDATE CASCADE ON DELETE CASCADE;
 :   ALTER TABLE ONLY public.tickets DROP CONSTRAINT topic_id;
       public               postgres    false    218    222    4662            �   a   x�3�0�b����]�}a@��S�����đ3��(� ��x��/��taׅ���F�fƮN�%\F��w��pq6232���� �H1L      �     x��T�nE]��b�У~?������%Vlj��5�A�LPv���X#)|�Ŏ�C�=D�\6�"ҝ���3�֩�*��`,�0"%u�z���+�$���|5?�O�[��|����:�Y^��+�+V�>F��C;J$��%:�I#��a���o7��#���+B%����U��QVri>�j�o���#�v�8F�	�q&��zң��c��J�'��8%C�4F������N���8Li�w��T� ��oBN|:�8��?@���54��n��#�B5��PX&�W)�t���q]����ݝ�'�۫/��{��g�������v�O�������e��,��c�uC�3�.Y6^Y�ie��j�^'{N�3>PF[S��U^�7��TC=?�����ʿ��u��oщf���|Up�|��O������"�5s��-�Q�HV�H`�)	�L� �	DPt�^�U�m>� _a�^��MP���\ԥ��b��7�n�y]
�p��	:�(���o�����^V�t���j�n9k��ƨ"����w�!�(�A	�4���:[�_�m���.0�5�X:/�������8���T�B���}/�=���饣iÅ5���uߋ`�H:�{" ���$��t�i���{~��d>_��I�a��ﭸ����ٲ?���Y`4:N:�����9�Ж�Q֔��b��i�i�i�Ӝ�-&��+	�����H,������9��g��{�?�F���0Ʊ�ز�8m�f��y]�Y�xa�]��M�����!}      �   �   x�=N[
�@�ޜ�'|��ô�(��x���v�l{�ɍ��C��Lf&�ˀ;��Hv�Ta@����o�Z�Η�
��		O�T�-H'��Я����I��N%��R��#�\�P�ڞ���,(�ܨw�<f2V�Z��.�3�ɣ�Nδy�h�ղ[��TÑ�      �   '  x�]�Ks�0 ���;�&�$��V�uD|B/�U,>:)�__;ڋ���η�DY[a�I(bp�8`Ƅ��ELx�>�7}:T�=�7�r�Aճ>`u���8���F=<M�m��f��g��:ᦋ�e�D�fa���Է��؆Ėr@-@(�Q*��jR����1]���,XeM�Y�RI���ʏ�q0};8bg->/�Ǥ	.�vfT�Cw�yė�
�H���0@rQ)���湯k�O���0o���%����s�5�X0J��y��*�.�N֫�z}��X tZ     