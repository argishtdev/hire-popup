<template>
  <div class="modal-component">
      <b-button @click="$bvModal.show('hire-modal')" variant="outline-primary">Create new content</b-button>
      <b-modal id="hire-modal" hide-header hide-footer >
          <img :src="order.images.thumbnail" class="main-image" alt="">
          <b-button @click="$bvModal.hide('hire-modal')" class="back-button">
              <font-awesome-icon icon="arrow-left" />
          </b-button>
          <div class="header-section hr">
              <h3>10 healthy fruits you should eat</h3>
              <b-link class="bg-light bg-light-link" :href="order.header.publication.startsWith('http') ? order.header.publication : 'http://' + order.header.publication" target="_blank">{{order.header.publication}}</b-link>
              <p class="blue-text">{{order.header.description}}</p>
          </div>
          <ValidationObserver v-slot="{ invalid }">
              <b-form class="overflow-hidden">
                  <div class="body-section">
                      <template v-for="group in order.Order_details">
                          <!--eslint-disable-next-line-->
                          <b-form-group
                                      v-if="group.name === 'source'"
                                      label="source"
                                      label-for="source"
                              >
                                  <validation-provider
                                          :rules="isUrl"
                                          v-slot="{ errors }"
                                          name="source"
                                  >
                                      <b-form-input
                                              id="source"
                                              v-model="newOrder.source"
                                              type="text"
                                              required
                                              :placeholder="group.placeholder"
                                      ></b-form-input>
                                      <span>{{ errors[0] }}</span>
                                  </validation-provider>
                              </b-form-group>
                          <!--eslint-disable-next-line-->
                          <b-form-group
                                  v-if="group.name === 'instructions'"
                                  label="instructions"
                                  label-for="source"
                          >
                              <validation-provider
                                      :rules="wordsLimit"
                                      v-slot="{ errors }"
                                      name="instructions"
                              >
                                  <b-form-textarea
                                          id="instructions"
                                          v-model="newOrder.instructions"
                                          required
                                          :placeholder="group.placeholder"
                                          rows="3"
                                          max-rows="6"
                                  ></b-form-textarea>
                                  <span>{{ errors[0] }}</span>
                              </validation-provider>
                          </b-form-group>
                          <!--eslint-disable-next-line-->
                          <div v-if="group.name === 'number_writers'" class="w-50 pr-3 float-left">
                              <b-form-group
                                      label="number of writers"
                                      label-for="number_writers"
                                      class="position-relative"
                              >
                                  <validation-provider
                                          rules="between:1,15"
                                          v-slot="{ errors }"
                                          name="number of writers"
                                  >
                                      <b-form-select v-model="newOrder.number_writers" :options="writersCountArray"></b-form-select>
                                      <span class="select-icon">
                                          <font-awesome-icon icon="chevron-down" />
                                      </span>
                                      <span>{{ errors[0] }}</span>
                                  </validation-provider>
                              </b-form-group>

                          </div>
                          <!--eslint-disable-next-line-->
                          <div v-if="group.name === 'budget'" class="w-50 float-left">
                              <b-form-group
                                      label="budget (USD)"
                                      label-for="budget"
                              >
                                  <validation-provider
                                          rules="between:5,500"
                                          v-slot="{ errors }"
                                          name="budget"
                                  >
                                      <b-form-input
                                              id="budget"
                                              v-model="newOrder.budget"
                                              type="text"
                                              :placeholder="group.placeholder"
                                      ></b-form-input>
                                      <span>{{ errors[0] }}</span>
                                  </validation-provider>
                              </b-form-group>
                          </div>
                      </template>
                      <div class="subtitle px-3 py-2">Please select options (optional)</div>
                      <div class="options">
                          <b-container>
                              <!--eslint-disable-next-line-->
                              <b-row v-for="option, index in order.options" :key="option.name" class="option-row hr py-2">
                                  <b-col cols="6" sm="4">{{option.name}}</b-col>
                                  <b-col cols="4" v-if="option.increase" class="option-description">add ({{option.increase}}%)</b-col>
                                  <b-col cols="4" v-if="option.price" class="option-description">add (${{option.price}})</b-col>
                                  <b-col cols="2" sm="4" class="text-right">
                                      <b-form-radio :value="index" v-model="newOrder.option" name="option" size="sm"></b-form-radio>
                                  </b-col>
                              </b-row>
                              <b-row class="option-row hr py-2">
                                  <b-col cols="6" sm="4">No option</b-col>
                                  <b-col cols="4" class="option-description">no add</b-col>
                                  <b-col cols="2" sm="4" class="text-right">
                                      <b-form-radio value="" v-model="newOrder.option" name="option" size="sm"></b-form-radio>
                                  </b-col>
                              </b-row>
                          </b-container>
                      </div>
                  </div>
                  <div class="footer-section">
                      <b-button :disabled="invalid" block class="mb-2">
                          <font-awesome-icon icon="shopping-cart" class="cart-icon float-left"/>
                          <span class="h4">SUBMIT</span>
                          <span class="totalSum float-right">$ {{totalSum}}</span>
                      </b-button>
                  </div>
              </b-form>
          </ValidationObserver>
      </b-modal>
  </div>
</template>

<script>
import { ValidationObserver } from 'vee-validate'
export default {
  components: {
    ValidationObserver
  },
  props: {
    order: Object
  },
  data () {
    return {
      newOrder: {
        source: '',
        instructions: '',
        number_writers: 1,
        option: '',
        budget: null
      },
      maxNumbersWriter: 15,
      writersCountArray: [],
      sum: null,
      isUrl: {
        regex: "^(?:http(s)?:\\/\\/)?[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-\\._~:/?#[\\]@!\\$&'\\(\\)\\*\\+,;=.]+$"
      },
      wordsLimit: {
        regex: '^(?:\\b\\w+\\b[\\s\\r\\n]*){0,50}$'
      }
    }
  },
  mounted () {
    // For changing rows number in `writers number` select-box change maxNumbersWriter value
    for (let i = 1; i <= this.maxNumbersWriter; i++) {
      this.$set(this.writersCountArray, i - 1, i)
    }
  },
  computed: {
    // Returns total price
    totalSum: function () {
      let sum = this.newOrder.number_writers * this.newOrder.budget
      if (this.newOrder.option !== '') {
        console.log(this.order.options[this.newOrder.option]['increase'])
        if (this.order.options[this.newOrder.option]['increase']) {
          sum += sum * this.order.options[this.newOrder.option]['increase'] / 100
        } else if (this.order.options[this.newOrder.option]['price']) {
          sum += Number(this.order.options[this.newOrder.option]['price'])
        }
      }
      return sum
    }
  }
}
</script>

<style scoped>
    .back-button {
        position: absolute;
        background: #fff;
        color: lightgrey;
        left: 20px;
        top: 20px;
        border-radius: 50%;
    }
    .header-section, .body-section, .footer-section {
        padding: 1rem;
    }
    .bg-light-link {
        padding: 5px;
        color: aqua;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
    }
    .blue-text {
        color: #0052e8;
        font-weight: bold;
    }
    .hr {
        border-bottom: 1px solid lightgrey;
    }
    input.form-control, input.form-control:focus, textarea.form-control {
        background: #f1f0f0;
        color: grey;
        border: transparent;
        box-shadow: none;
    }
    .select-icon {
        position: absolute;
        z-index: 2;
        right: .75rem;
        color: darkgrey;
        line-height: 36px;
    }
    .subtitle {
        background: gray;
        color: #000;
        font-size: 12px;
        font-weight: bold;
        clear: both;
        margin-right: -16px;
        margin-left: -16px;
    }
    .option-row:last-child {
        border-bottom-color: transparent;
    }
    .option-description {
        color: #d6dada;
    }
    .footer-section button, .footer-section button:not(:disabled):not(.disabled):active {
        background: #0052e8;
        border-color: #0052e8;
    }
    .footer-section button:focus {
        box-shadow: 0 0 0 0.2rem rgba(30, 144, 255, 0.5);
    }
    .footer-section .cart-icon {
        margin-top: 7px;
    }
    .totalSum {
        padding-top: 2px;
        font-weight: bold;
    }
</style>
