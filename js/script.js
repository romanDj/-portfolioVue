Vue.config.devtools = true;
Vue.use(VueYouTubeEmbed.default);

let categoryVisible = false;
let presentationVisible = true;


//вот компоненты которые в верстке используются
Vue.component('gallery',{
    props: ['data_works'],
    data: function(){
        return {
            rows: []
        }
    },
    //разбиваем общий массив на строки
    created(){
        let count_row;
        let  ostatok_row = this.data_works.length % 7;
        if(ostatok_row > 0){
            count_row = Math.floor(this.data_works.length / 7)+1;
        }else if(ostatok_row == 0){
            count_row = Math.floor(this.data_works.length / 7);
        }
        for(let i=0; i < count_row; i++){
            this.rows[i] = [];
            for(item in this.data_works){
                    //проверка четная или нечетная строка, для добавления большой картинки
                    let size_photo = '';
                    if((i+1) % 2 == 1){
                        //нечет
                        if(this.rows[i].length == 0){
                            size_photo = 'big'
                        }else{
                            size_photo = 'little';
                        }
                    } else {
                        //чет
                        if(this.rows[i].length == 4){
                            size_photo = 'big'
                        }else{
                            size_photo = 'little';
                        }
                    }
                    //добавляем по семь в строку
                    if(item <= ((i+1) * 7 - 1) && item > ((i+1) * 7 - 1 - 7)){
                        this.rows[i].push({
                            id: this.data_works[item].id,
                            photo: this.data_works[item].photo,
                            background: this.data_works[item].background,
                            short_desc: this.data_works[item].short_desc,
                            size: size_photo
                        });
                    }
            }
        }
    },
    template: `<div class="gallery"><row v-for="n in rows.length" :data_works="rows[n-1]"></row></div>`
});

Vue.component('row',{
    props: ['data_works'],
    data: function(){
        return {}
    },
    template: `<div class="row"><photo
                    v-for="item in data_works"
                    :key="item.id"
                    :id="item.id"
                    :short_desc="item.short_desc"
                    :photo="item.photo"
                    :background="item.background"
                    :size="item.size"
                 ></photo></div>`
});

Vue.component('photo',{
    props: ['id', 'short_desc', 'photo', 'background', 'size'],
    data: function(){
        return {

        }
    },
    methods:{
        displayPresentation(el){
            $('body').css({'overflow': 'hidden'});
            vm.currentWork = this.id;
            vm.presentation = true;
        }
    },
    template: `<div v-bind:class="['photo', size]"  @click=" displayPresentation">
                        <img :src="'img_gallery/'+photo" alt="#">
                        <div class="info" v-bind:style="{background: background, color: 'white'}">
                            <div>
                                <h4>Work #{{id}}</h4>
                                <p>{{short_desc}}</p>
                            </div>
                        </div>
                    </div>`
});

Vue.component('presentation_slider',{
    props: ['work', 'number'],
    data: function(){
        return {
            players: [],
            sliders: []
        }
    },
    computed: {
        seen : function () {
            return this.work.id == vm.currentWork ? true : false;
        },
        lastSlider: function () {
            return vm.lastSlider;
        },
        slideAnimation:function () {
            return vm.slideAnimation;
        }
    },
    created(){
        for(item in this.work.presentation.slider){
            let check = false;
            if(item == 0){
                check = true;
            }
            this.sliders.push({ type: this.work.presentation.slider[item].type,
                name: this.work.presentation.slider[item].name,
                check: check
            });
        }
    },
    methods:{
        hiddenPresentation(){
            vm.presentation = false;
            $('body').css({'overflow':'auto'});
        },
        lastSlide(){

            //остановка прроигрываемых видео
            jQuery("iframe").each(function() {
                jQuery(this)[0].contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*')});

            vm.lastSlider = vm.works[this.number].id;
            if(this.number != 0){
                vm.currentWork = vm.works[this.number - 1].id;
                $('.presentation_list').css({'background': vm.works[this.number - 1].background});
            }else{
                vm.currentWork = vm.works[vm.works.length - 1].id;
                $('.presentation_list').css({'background': vm.works[vm.works.length - 1].background});
            }
            vm.lastSlider = null;
            setTimeout(function () {

            }, 100);
        },
        nextSlide(){

            //остановка прроигрываемых видео
            jQuery("iframe").each(function() {
                jQuery(this)[0].contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*')});

            vm.lastSlider = vm.works[this.number].id;
            let thisNum = this.number;
                if(this.number != (vm.works.length - 1)){
                    vm.currentWork = vm.works[this.number + 1].id;
                }else{
                    vm.currentWork = vm.works[0].id;
                    vm.lastSlider = null;
                    $('.presentation_list').css({'background': vm.works[0].background});
                }
        },
        select_slide_presention(index){
            for(item in this.sliders){
                if(item == index){
                    this.sliders[item].check = true;
                }else{
                    this.sliders[item].check = false;
                }
            }
        }
    },
    template: `<transition v-bind:name="slideAnimation"><div v-bind:style="{background: work.background }" v-if="seen == true || lastSlider == work.id" class="presentation" >
                    <div class="content_presentation">
                        <div class="content_slide">
                            <div class="info_text">
                                <div class="zagolovok">
                                    <h4>{{work.presentation.name}} #{{work.id}}</h4>
                                    <p>{{work.presentation.short_desc}}</p>
                                </div>
                                <div class="usual">
                                    <div class="slider">
                                        <div class="slider_win">
                                        
                                           
                                             <div v-for="item in sliders" v-show="item.check">
                                                <template v-if="item.type == 'photo'">
                                                    <img :src="'img_gallery/'+item.name" alt="#">
                                                </template>
                                                <template v-else>
                                                    <youtube :video-id="item.name"></youtube>
                                                </template>
                                            </div>
                                            
                                         
                                           
                                        </div>
                                        <div class="listener">
                                            <div v-for="(item, index) in sliders" @click="select_slide_presention(index)" class="elipse" :class="{elipse_check: item.check }"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="attribute">
                                <div class="item_attribute author">
                                    <h4>Автор | </h4>
                                    <p>{{work.author}}</p>
                                </div>
                                <div class="item_attribute category">
                                    <h4>Категории | </h4>
                                    <p>{{work.category}}</p>
                                </div>
                                <div class="item_attribute date">
                                    <h4>Дата | </h4>
                                    <p>{{work.date}}</p>
                                </div>
                            </div>
                        </div>
                        <img src="img/close.png" alt="#" @click="hiddenPresentation"  class="close">
                        <div class="navigation">
                            <img src="img/next.png" alt="#" @click="lastSlide" class="strelka last">
                            <img src="img/next.png" alt="#" @click="nextSlide" class="strelka next">
                        </div>
                        <div class="action_sheet">
                            <div class="action"><a href="#" @click.prevent="nextSlide">Следующий проект</a></div>
                            <div class="action"><a href="#" @click.prevent="lastSlide">Предыдущий проект</a></div>
                            <div class="action"><a href="#" @click.prevent="hiddenPresentation">Главная</a></div>
                            <div class="action"><a href="#">Писать</a></div>
                        </div>
                    </div>
                    <div class="curtain" v-bind:style="{background: work.background }">
                        <div class="preloader"></div>
                    </div>
                </div></transition>`
});

// <div class="notes" v-html="work.presentation.notes"></div>

Vue.component('category_panel',{
    props:['list_category'],
    methods:{
        select:function(item){

            for(cat of this.list_category){
                cat.select = false;
            }

            item.select = true;
        }
    },
    template:` <div class="category_panel">
                    <h4>Категории</h4>
                    <a href="#" v-for="item in list_category" :class="{select_category: item.select}" @click="select(item)">{{item.label}}</a>
                </div>`
});

//это корневой компонент, здесь все данные и состояния хранятся
var vm = new Vue({
    el: '.main',
    data: {
        showNav: false,
        presentation: false,
        currentWork: 1,
        lastSlider: null,
        slideAnimation: '',
        category_panel_visible: false,
        categories: [
            { label: 'всё', id: '', select: true },
            { label: 'веб', id: '', select: false },
            { label: 'люстры', id: '', select: false },
            { label: 'анимашки', id: '', select: false },
            { label: 'брендинг', id: '', select: false },
            { label: 'сиськи', id: '', select: false },
            { label: 'хуи', id: '', select: false },
            { label: 'что-то другое', id: '', select: false }
            ],
        works: [
            {
                id: 1,
                photo: 'photo1.jpg',
                background: '#999966',
                author: 'dima',
                category: 'рисунок, анимация',
                date: '12 марта 2018',
                short_desc: 'Короткое описание работы в несколько строк',
                presentation: {
                    name: 'Чувак со шляпой ',
                    short_desc: 'Производство для каких-то нищебродов, которые зажали 20 тысяч на нормальный продакшен',
                    notes:`<p>
                              Тут можно писать всякую ересь разными шрифтами для лучшего поиска или отображения информации, которую хотят получить от меня какие-то уроды.
                           </p>
                           <p class="bold">
                              А тут будут формироваться заметки о сложности какой-либо ебаты, типо перекрасить два раза, да как нехуй делать, или что-то типо того. Заказчику не нравилось, как 1.5 минуты бегал персонаж, хуйня. Переделаем. и т.д.
                           </p>
                           <p>
                              Наш надёжный партнёр ООО «ТД «Ферекс» — татарстанский производитель светодиодных светильников. Среди их преимуществ значатся:
                           </p>`,
                    slider:[
                        {
                            type: 'photo',
                            name: 'photo2.jpg'
                        },
                        {
                            type: 'photo',
                            name: 'photo3.jpg'
                        },
                        {
                            type: 'video',
                            name: 'WRgxXRUAX-Q'
                        },
                    ]
                }
            },
            {
                id: 2,
                photo: 'photo2.jpg',
                background: '#eccc68',
                author: 'dima',
                category: 'рисунок, анимация',
                date: '12 марта 2018',
                short_desc: 'Короткое описание работы в несколько строк',
                presentation: {
                    name: 'Ракета в жопу ',
                    short_desc: 'Производство для каких-то нищебродов, которые зажали 20 тысяч на нормальный продакшен',
                    notes:`<p>
                              Тут можно писать всякую ересь разными шрифтами для лучшего поиска или отображения информации, которую хотят получить от меня какие-то уроды.
                           </p>
                           <p class="bold">
                              А тут будут формироваться заметки о сложности какой-либо ебаты, типо перекрасить два раза, да как нехуй делать, или что-то типо того. Заказчику не нравилось, как 1.5 минуты бегал персонаж, хуйня. Переделаем. и т.д.
                           </p>
                           <p>
                              Наш надёжный партнёр ООО «ТД «Ферекс» — татарстанский производитель светодиодных светильников. Среди их преимуществ значатся:
                           </p>`,
                    slider:[
                        {
                            type: 'photo',
                            name: 'photo2.jpg'
                        },
                        {
                            type: 'photo',
                            name: 'photo3.jpg'
                        },
                        {
                            type: 'video',
                            name: 'WRgxXRUAX-Q'
                        },
                    ]
                }
            },
            {
                id: 3,
                photo: 'photo3.jpg',
                background: '#ff7f50',
                author: 'dima',
                category: 'рисунок, анимация',
                date: '12 марта 2018',
                short_desc: 'Короткое описание работы в несколько строк',
                presentation: {
                    name: 'Чувак со шляпой ',
                    short_desc: 'Производство для каких-то нищебродов, которые зажали 20 тысяч на нормальный продакшен',
                    notes:`<p>
                              Тут можно писать всякую ересь разными шрифтами для лучшего поиска или отображения информации, которую хотят получить от меня какие-то уроды.
                           </p>
                           <p class="bold">
                              А тут будут формироваться заметки о сложности какой-либо ебаты, типо перекрасить два раза, да как нехуй делать, или что-то типо того. Заказчику не нравилось, как 1.5 минуты бегал персонаж, хуйня. Переделаем. и т.д.
                           </p>
                           <p>
                              Наш надёжный партнёр ООО «ТД «Ферекс» — татарстанский производитель светодиодных светильников. Среди их преимуществ значатся:
                           </p>`,
                    slider:[
                        {
                            type: 'photo',
                            name: 'photo2.jpg'
                        },
                        {
                            type: 'photo',
                            name: 'photo3.jpg'
                        },
                        {
                            type: 'video',
                            name: 'WRgxXRUAX-Q'
                        },
                    ]
                }
            },
            {
                id: 4,
                photo: 'photo4.jpg',
                background: '#70a1ff',
                author: 'dima',
                category: 'рисунок, анимация',
                date: '12 марта 2018',
                short_desc: 'Короткое описание работы в несколько строк',
                presentation: {
                    name: 'Чувак со шляпой ',
                    short_desc: 'Производство для каких-то нищебродов, которые зажали 20 тысяч на нормальный продакшен',
                    notes:`<p>
                              Тут можно писать всякую ересь разными шрифтами для лучшего поиска или отображения информации, которую хотят получить от меня какие-то уроды.
                           </p>
                           <p class="bold">
                              А тут будут формироваться заметки о сложности какой-либо ебаты, типо перекрасить два раза, да как нехуй делать, или что-то типо того. Заказчику не нравилось, как 1.5 минуты бегал персонаж, хуйня. Переделаем. и т.д.
                           </p>
                           <p>
                              Наш надёжный партнёр ООО «ТД «Ферекс» — татарстанский производитель светодиодных светильников. Среди их преимуществ значатся:
                           </p>`,
                    slider:[
                        {
                            type: 'photo',
                            name: 'photo2.jpg'
                        },
                        {
                            type: 'photo',
                            name: 'photo3.jpg'
                        },
                        {
                            type: 'video',
                            name: 'WRgxXRUAX-Q'
                        },
                    ]
                }
            },
            {
                id: 5,
                photo: 'photo5.jpg',
                background: '#2ed573',
                author: 'dima',
                category: 'рисунок, анимация',
                date: '12 марта 2018',
                short_desc: 'Короткое описание работы в несколько строк',
                presentation: {
                    name: 'Чувак со шляпой ',
                    short_desc: 'Производство для каких-то нищебродов, которые зажали 20 тысяч на нормальный продакшен',
                    notes:`<p>
                              Тут можно писать всякую ересь разными шрифтами для лучшего поиска или отображения информации, которую хотят получить от меня какие-то уроды.
                           </p>
                           <p class="bold">
                              А тут будут формироваться заметки о сложности какой-либо ебаты, типо перекрасить два раза, да как нехуй делать, или что-то типо того. Заказчику не нравилось, как 1.5 минуты бегал персонаж, хуйня. Переделаем. и т.д.
                           </p>
                           <p>
                              Наш надёжный партнёр ООО «ТД «Ферекс» — татарстанский производитель светодиодных светильников. Среди их преимуществ значатся:
                           </p>`,
                    slider:[
                        {
                            type: 'photo',
                            name: 'photo2.jpg'
                        },
                        {
                            type: 'photo',
                            name: 'photo3.jpg'
                        },
                        {
                            type: 'video',
                            name: 'WRgxXRUAX-Q'
                        },
                    ]
                }
            },
            {
                id: 6,
                photo: 'photo6.png',
                background: '#5352ed',
                author: 'dima',
                category: 'рисунок, анимация',
                date: '12 марта 2018',
                short_desc: 'Короткое описание работы в несколько строк',
                presentation: {
                    name: 'Чувак со шляпой ',
                    short_desc: 'Производство для каких-то нищебродов, которые зажали 20 тысяч на нормальный продакшен',
                    notes:`<p>
                              Тут можно писать всякую ересь разными шрифтами для лучшего поиска или отображения информации, которую хотят получить от меня какие-то уроды.
                           </p>
                           <p class="bold">
                              А тут будут формироваться заметки о сложности какой-либо ебаты, типо перекрасить два раза, да как нехуй делать, или что-то типо того. Заказчику не нравилось, как 1.5 минуты бегал персонаж, хуйня. Переделаем. и т.д.
                           </p>
                           <p>
                              Наш надёжный партнёр ООО «ТД «Ферекс» — татарстанский производитель светодиодных светильников. Среди их преимуществ значатся:
                           </p>`,
                    slider:[
                        {
                            type: 'photo',
                            name: 'photo2.jpg'
                        },
                        {
                            type: 'photo',
                            name: 'photo3.jpg'
                        },
                        {
                            type: 'video',
                            name: 'WRgxXRUAX-Q'
                        },
                    ]
                }
            },
            {
                id: 7,
                photo: 'photo7.jpg',
                background: '#747d8c',
                author: 'dima',
                category: 'рисунок, анимация',
                date: '12 марта 2018',
                short_desc: 'Короткое описание работы в несколько строк',
                presentation: {
                    name: 'Чувак со шляпой ',
                    short_desc: 'Производство для каких-то нищебродов, которые зажали 20 тысяч на нормальный продакшен',
                    notes:`<p>
                              Тут можно писать всякую ересь разными шрифтами для лучшего поиска или отображения информации, которую хотят получить от меня какие-то уроды.
                           </p>
                           <p class="bold">
                              А тут будут формироваться заметки о сложности какой-либо ебаты, типо перекрасить два раза, да как нехуй делать, или что-то типо того. Заказчику не нравилось, как 1.5 минуты бегал персонаж, хуйня. Переделаем. и т.д.
                           </p>
                           <p>
                              Наш надёжный партнёр ООО «ТД «Ферекс» — татарстанский производитель светодиодных светильников. Среди их преимуществ значатся:
                           </p>`,
                    slider:[
                        {
                            type: 'photo',
                            name: 'photo2.jpg'
                        },
                        {
                            type: 'photo',
                            name: 'photo3.jpg'
                        },
                        {
                            type: 'video',
                            name: 'WRgxXRUAX-Q'
                        },
                    ]
                }
            },
            {
                id: 8,
                photo: 'photo8.jpg',
                background: ' #999966',
                author: 'dima',
                category: 'рисунок, анимация',
                date: '12 марта 2018',
                short_desc: 'Короткое описание работы в несколько строк',
                presentation: {
                    name: 'Чувак со шляпой ',
                    short_desc: 'Производство для каких-то нищебродов, которые зажали 20 тысяч на нормальный продакшен',
                    notes:`<p>
                              Тут можно писать всякую ересь разными шрифтами для лучшего поиска или отображения информации, которую хотят получить от меня какие-то уроды.
                           </p>
                           <p class="bold">
                              А тут будут формироваться заметки о сложности какой-либо ебаты, типо перекрасить два раза, да как нехуй делать, или что-то типо того. Заказчику не нравилось, как 1.5 минуты бегал персонаж, хуйня. Переделаем. и т.д.
                           </p>
                           <p>
                              Наш надёжный партнёр ООО «ТД «Ферекс» — татарстанский производитель светодиодных светильников. Среди их преимуществ значатся:
                           </p>`,
                    slider:[
                        {
                            type: 'photo',
                            name: 'photo2.jpg'
                        },
                        {
                            type: 'photo',
                            name: 'photo3.jpg'
                        },
                        {
                            type: 'video',
                            name: 'WRgxXRUAX-Q'
                        },
                    ]
                }
            },
            {
                id: 9,
                photo: 'photo9.jpg',
                background: ' #999966',
                author: 'dima',
                category: 'рисунок, анимация',
                date: '12 марта 2018',
                short_desc: 'Короткое описание работы в несколько строк',
                presentation: {
                    name: 'Чувак со шляпой ',
                    short_desc: 'Производство для каких-то нищебродов, которые зажали 20 тысяч на нормальный продакшен',
                    notes:`<p>
                              Тут можно писать всякую ересь разными шрифтами для лучшего поиска или отображения информации, которую хотят получить от меня какие-то уроды.
                           </p>
                           <p class="bold">
                              А тут будут формироваться заметки о сложности какой-либо ебаты, типо перекрасить два раза, да как нехуй делать, или что-то типо того. Заказчику не нравилось, как 1.5 минуты бегал персонаж, хуйня. Переделаем. и т.д.
                           </p>
                           <p>
                              Наш надёжный партнёр ООО «ТД «Ферекс» — татарстанский производитель светодиодных светильников. Среди их преимуществ значатся:
                           </p>`,
                    slider:[
                        {
                            type: 'photo',
                            name: 'photo2.jpg'
                        },
                        {
                            type: 'photo',
                            name: 'photo3.jpg'
                        },
                        {
                            type: 'video',
                            name: 'WRgxXRUAX-Q'
                        },
                    ]
                }
            },
            {
                id: 10,
                photo: 'photo10.jpg',
                background: ' #999966',
                author: 'dima',
                category: 'рисунок, анимация',
                date: '12 марта 2018',
                short_desc: 'Короткое описание работы в несколько строк',
                presentation: {
                    name: 'Чувак со шляпой ',
                    short_desc: 'Производство для каких-то нищебродов, которые зажали 20 тысяч на нормальный продакшен',
                    notes:`<p>
                              Тут можно писать всякую ересь разными шрифтами для лучшего поиска или отображения информации, которую хотят получить от меня какие-то уроды.
                           </p>
                           <p class="bold">
                              А тут будут формироваться заметки о сложности какой-либо ебаты, типо перекрасить два раза, да как нехуй делать, или что-то типо того. Заказчику не нравилось, как 1.5 минуты бегал персонаж, хуйня. Переделаем. и т.д.
                           </p>
                           <p>
                              Наш надёжный партнёр ООО «ТД «Ферекс» — татарстанский производитель светодиодных светильников. Среди их преимуществ значатся:
                           </p>`,
                    slider:[
                        {
                            type: 'photo',
                            name: 'photo2.jpg'
                        },
                        {
                            type: 'photo',
                            name: 'photo3.jpg'
                        },
                        {
                            type: 'video',
                            name: 'WRgxXRUAX-Q'
                        },
                    ]
                }
            },
            {
                id: 11,
                photo: 'photo11.jpg',
                background: ' #999966',
                author: 'dima',
                category: 'рисунок, анимация',
                date: '12 марта 2018',
                short_desc: 'Короткое описание работы в несколько строк',
                presentation: {
                    name: 'Чувак со шляпой ',
                    short_desc: 'Производство для каких-то нищебродов, которые зажали 20 тысяч на нормальный продакшен',
                    notes:`<p>
                              Тут можно писать всякую ересь разными шрифтами для лучшего поиска или отображения информации, которую хотят получить от меня какие-то уроды.
                           </p>
                           <p class="bold">
                              А тут будут формироваться заметки о сложности какой-либо ебаты, типо перекрасить два раза, да как нехуй делать, или что-то типо того. Заказчику не нравилось, как 1.5 минуты бегал персонаж, хуйня. Переделаем. и т.д.
                           </p>
                           <p>
                              Наш надёжный партнёр ООО «ТД «Ферекс» — татарстанский производитель светодиодных светильников. Среди их преимуществ значатся:
                           </p>`,
                    slider:[
                        {
                            type: 'photo',
                            name: 'photo2.jpg'
                        },
                        {
                            type: 'photo',
                            name: 'photo3.jpg'
                        },
                        {
                            type: 'video',
                            name: 'WRgxXRUAX-Q'
                        },
                    ]
                }
            },

            {
                id: 12,
                photo: 'photo12.jpg',
                background: ' #999966',
                author: 'dima',
                category: 'рисунок, анимация',
                date: '12 марта 2018',
                short_desc: 'Короткое описание работы в несколько строк',
                presentation: {
                    name: 'Чувак со шляпой ',
                    short_desc: 'Производство для каких-то нищебродов, которые зажали 20 тысяч на нормальный продакшен',
                    notes:`<p>
                              Тут можно писать всякую ересь разными шрифтами для лучшего поиска или отображения информации, которую хотят получить от меня какие-то уроды.
                           </p>
                           <p class="bold">
                              А тут будут формироваться заметки о сложности какой-либо ебаты, типо перекрасить два раза, да как нехуй делать, или что-то типо того. Заказчику не нравилось, как 1.5 минуты бегал персонаж, хуйня. Переделаем. и т.д.
                           </p>
                           <p>
                              Наш надёжный партнёр ООО «ТД «Ферекс» — татарстанский производитель светодиодных светильников. Среди их преимуществ значатся:
                           </p>`,
                    slider:[
                        {
                            type: 'photo',
                            name: 'photo2.jpg'
                        },
                        {
                            type: 'photo',
                            name: 'photo3.jpg'
                        },
                        {
                            type: 'video',
                            name: 'WRgxXRUAX-Q'
                        },
                    ]
                }
            },
            {
                id: 13,
                photo: 'photo13.jpg',
                background: ' #999966',
                author: 'dima',
                category: 'рисунок, анимация',
                date: '12 марта 2018',
                short_desc: 'Короткое описание работы в несколько строк',
                presentation: {
                    name: 'Чувак со шляпой ',
                    short_desc: 'Производство для каких-то нищебродов, которые зажали 20 тысяч на нормальный продакшен',
                    notes:`<p>
                              Тут можно писать всякую ересь разными шрифтами для лучшего поиска или отображения информации, которую хотят получить от меня какие-то уроды.
                           </p>
                           <p class="bold">
                              А тут будут формироваться заметки о сложности какой-либо ебаты, типо перекрасить два раза, да как нехуй делать, или что-то типо того. Заказчику не нравилось, как 1.5 минуты бегал персонаж, хуйня. Переделаем. и т.д.
                           </p>
                           <p>
                              Наш надёжный партнёр ООО «ТД «Ферекс» — татарстанский производитель светодиодных светильников. Среди их преимуществ значатся:
                           </p>`,
                    slider:[
                        {
                            type: 'photo',
                            name: 'photo2.jpg'
                        },
                        {
                            type: 'photo',
                            name: 'photo3.jpg'
                        },
                        {
                            type: 'video',
                            name: 'WRgxXRUAX-Q'
                        },
                    ]
                }
            },
            {
                id: 14,
                photo: 'photo14.jpg',
                background: ' #999966',
                author: 'dima',
                category: 'рисунок, анимация',
                date: '12 марта 2018',
                short_desc: 'Короткое описание работы в несколько строк',
                presentation: {
                    name: 'Чувак со шляпой ',
                    short_desc: 'Производство для каких-то нищебродов, которые зажали 20 тысяч на нормальный продакшен',
                    notes:`<p>
                              Тут можно писать всякую ересь разными шрифтами для лучшего поиска или отображения информации, которую хотят получить от меня какие-то уроды.
                           </p>
                           <p class="bold">
                              А тут будут формироваться заметки о сложности какой-либо ебаты, типо перекрасить два раза, да как нехуй делать, или что-то типо того. Заказчику не нравилось, как 1.5 минуты бегал персонаж, хуйня. Переделаем. и т.д.
                           </p>
                           <p>
                              Наш надёжный партнёр ООО «ТД «Ферекс» — татарстанский производитель светодиодных светильников. Среди их преимуществ значатся:
                           </p>`,
                    slider:[
                        {
                            type: 'photo',
                            name: 'photo2.jpg'
                        },
                        {
                            type: 'photo',
                            name: 'photo3.jpg'
                        },
                        {
                            type: 'video',
                            name: 'WRgxXRUAX-Q'
                        },
                    ]
                }
            }

        ]
    },
    beforeCreate:function(){

    },
    created:function () {
        if (window.innerWidth > 745) {
            this.showNav = true;

        } else {
            this.showNav = false;
        }
        resize_win();
    },

    mounted() {
        //отслеживание размеров экрана
        window.onresize = (event) => {
            if (window.innerWidth > 745) {
                this.showNav = true;
            } else {
                this.showNav = false;
            }
            resize_win();
            present_win();
        };

    },
    watch:{
        currentWork: function () {
            present_win();
        },
        slideAnimation: function () {
            present_win();
        },
    },
    methods: {
        category_panel: function(){
            this.category_panel_visible =! this.category_panel_visible;
        },
        //для анимации переходов между слайдов
        enterCancelled:function (el) {
            $('.curtain').css({'display': 'block'});
            setTimeout(function () {
                $('.preloader').css({'display': 'block'});
                //$('.content_presentation').css({'display': 'block'});

                setTimeout(function () {
                    $('.preloader').css({'display': 'none'});
                    $('.curtain').animate({'width': '0'}, 1200, function () {
                        $('.curtain').css({'display': 'none', 'width': '100%'});
                    });
                }, 3600);

                }, 600);
            this.slideAnimation = 'next_slide';
        },
        leave: function () {
            this.slideAnimation = '';

        },
        after_hide_presentation: function () {
            this.lastSlider = null;
            $('.curtain').css({'display': 'block'});
        }
    }
});



//подогнать размер фоток в плитках
function resize_win(){
    setTimeout(function(){
        $('.photo').each(function (index) {
            let wThis = $('.photo:eq('+index+')').width();
            let hThis = $('.photo:eq('+index+')').height();
            let widthImg = $('.photo:eq('+index+')').find('img').width();
            let heightImg = $('.photo:eq('+index+')').find('img').height();

            if(widthImg >= heightImg){
                $('.photo:eq('+index+')').find('img').css({ 'height' : hThis + 'px',  'width': 'auto'});
            }else if(widthImg <= heightImg){
                $('.photo:eq('+index+')').find('img').css({ 'height' : 'auto',  'width': wThis + 'px'});
            }
        });
    },5);
}


//подогнать размер слайдера
function present_win(){

    setTimeout(function () {
        if(window.innerWidth > 1020){
            $('.content_slide').each(function () {
                let heightThis = $(this).height();
                let heightZag = $(this).find('.zagolovok').height();
                let heightSlide = heightThis - 40 - heightZag - 65;
                $(this).find('.slider_win').css({'height': heightSlide+'px'});

                setTimeout(function () {
                    $('iframe').css({'height': heightSlide+'px'});
                }, 10);

            });
        }
    },10);

}


$(document).ready(function () {
    resize_win();
});
